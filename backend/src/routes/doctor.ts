import { Router } from 'express';
import Patient from '../models/Patient.js';
import ClinicalSession from '../models/ClinicalSession.js';
import MedicalDocument from '../models/MedicalDocument.js';
import type { IClinicalSession } from '../models/ClinicalSession.js';

const router = Router();

router.get("/queue", async (req, res) => {
  try {
    // Only a completed intake is ready for practitioner review. Active interviews
    // remain private to the patient until the case-taking flow is complete.
    const { hospitalName, doctorId } = req.query;
    // Keep unfinished patient interviews private, but retain both review-ready
    // and practitioner-finalised cases in the clinician's history.
    const filters: Record<string, unknown> = {
      status: { $in: ["completed", "reviewed"] },
    };
    if (hospitalName) filters.hospitalName = hospitalName;
    if (doctorId) {
      // Earlier prototype sessions stored the doctor display name; newer sessions
      // store the doctor ID. Support both while existing demo data is migrated.
      filters.doctorId =
        doctorId === "DR-1001"
          ? { $in: ["DR-1001", "Dr. Priya Sharma (Ayurveda)"] }
          : doctorId;
    }
    const sessions = await ClinicalSession.find(filters).populate("patientId");
    res.json({ queue: sessions });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch queue" });
  }
});

router.get("/case/:sessionId", async (req, res) => {
  try {
    const session = await ClinicalSession.findById(
      req.params.sessionId,
    ).populate("patientId");
    if (!session) return res.status(404).json({ error: "Session not found" });

    const documents = await MedicalDocument.find({
      patientId: session.patientId,
    });

    res.json({ session, documents });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch case details" });
  }
});

router.post("/case/:sessionId/validate-intake", async (req, res) => {
  try {
    const session = await ClinicalSession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });
    session.practitionerReview = {
      ...(session.practitionerReview || {}),
      verified: false,
      intakeValidated: true,
      intakeValidatedAt: new Date(),
    };
    await session.save();
    res.json({ session });
  } catch (err) {
    res.status(500).json({ error: "Failed to validate intake" });
  }
});

// The practitioner validates the intake and records the final clinical plan.
router.post("/case/:sessionId/finalize", async (req, res) => {
  try {
    const session = await ClinicalSession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });
    const { assessment, plan, followUpDate } = req.body;
    if (!assessment?.trim() || !plan?.trim()) return res.status(400).json({ error: 'Assessment and plan are required' });
    const practitionerReview: NonNullable<IClinicalSession['practitionerReview']> = {
      verified: true,
      intakeValidated: true,
      intakeValidatedAt:
        session.practitionerReview?.intakeValidatedAt || new Date(),
      assessment: assessment.trim(),
      plan: plan.trim(),
      reviewedAt: new Date()
    };
    if (followUpDate) practitionerReview.followUpDate = new Date(followUpDate);
    session.practitionerReview = practitionerReview;
    session.status = 'reviewed';
    await session.save();
    res.json({ session });
  } catch (err) {
    res.status(500).json({ error: "Failed to finalise consultation" });
  }
});

router.post("/case/:sessionId/send-to-abha", async (req, res) => {
  try {
    const session = await ClinicalSession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (!session.practitionerReview?.verified)
      return res
        .status(400)
        .json({
          error: "Finalise the practitioner review before ABHA sharing",
        });
    res.json({
      status: "demo_sent",
      message: "Practitioner-approved record marked ready for ABHA sharing",
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to prepare ABHA sharing" });
  }
});

export default router;
