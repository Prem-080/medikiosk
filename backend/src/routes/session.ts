import { Router } from "express";
import ClinicalSession from "../models/ClinicalSession.js";
import Patient from "../models/Patient.js";
import { MockAIService } from "../services/MockAIService.js";

const router = Router();

// Patient-facing history, newest consultation first.
router.get("/patient/:patientId", async (req, res) => {
  try {
    const sessions = await ClinicalSession.find({
      patientId: req.params.patientId,
    }).sort({ createdAt: -1 });
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch patient sessions" });
  }
});

router.patch("/:sessionId/patient-intake", async (req, res) => {
  try {
    const session = await ClinicalSession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (session.status === "reviewed")
      return res
        .status(400)
        .json({
          error: "A practitioner-finalised consultation cannot be edited",
        });
    const { chiefComplaint } = req.body;
    if (!chiefComplaint?.trim())
      return res.status(400).json({ error: "Chief concern is required" });
    session.history = {
      ...session.history,
      chiefComplaint: chiefComplaint.trim(),
    };
    await session.save();
    res.json({ session });
  } catch (err) {
    res.status(500).json({ error: "Failed to update consultation" });
  }
});

router.delete("/:sessionId", async (req, res) => {
  try {
    const session = await ClinicalSession.findByIdAndDelete(
      req.params.sessionId,
    );
    if (!session) return res.status(404).json({ error: "Session not found" });
    res.json({ message: "Consultation deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete consultation" });
  }
});

// Start a new clinical session
router.post("/start", async (req, res) => {
  try {
    const { patientId, hospitalName, doctorId } = req.body;

    if (!patientId) {
      return res.status(400).json({ error: "patientId is required" });
    }
    const pId = patientId;

    // Preserve an unfinished intake so a patient can return and continue where
    // they left off instead of creating duplicate sessions.
    const activeSession = await ClinicalSession.findOne({
      patientId: pId,
      status: "active",
    }).sort({ createdAt: -1 });
    if (activeSession) {
      return res.json({ session: activeSession, resumed: true });
    }

    const initialQuestion = MockAIService.getNextQuestion([]);

    const session = await ClinicalSession.create({
      patientId: pId,
      hospitalName,
      doctorId,
      status: "active",
      conversation: [{ role: "ai", content: initialQuestion }],
      redFlags: [],
      history: {},
    });

    res.json({ session });
  } catch (err) {
    res.status(500).json({ error: "Failed to start session" });
  }
});

// Post a patient response and get next AI question
router.post("/:sessionId/chat", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;

    const session = await ClinicalSession.findById(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    // Add patient message
    session.conversation.push({
      role: "patient",
      content: message,
      timestamp: new Date(),
    });

    // Extract all patient responses
    const patientResponses = session.conversation
      .filter((msg) => msg.role === "patient")
      .map((msg) => msg.content);

    // Get next AI question
    const nextQuestion = MockAIService.getNextQuestion(patientResponses);
    session.conversation.push({
      role: "ai",
      content: nextQuestion,
      timestamp: new Date(),
    });

    // Detect red flags continuously
    session.redFlags = MockAIService.detectRedFlags(patientResponses);

    // If it's the last question (mock logic), generate history
    if (nextQuestion.includes("collected enough information")) {
      session.history =
        MockAIService.generateStructuredHistory(patientResponses);
      session.status = "completed";
    }

    await session.save();
    res.json({ session });
  } catch (err) {
    res.status(500).json({ error: "Failed to process chat" });
  }
});

export default router;
