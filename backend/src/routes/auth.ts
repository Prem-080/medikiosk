import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Patient from "../models/Patient.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

router.post("/register", async (req, res) => {
  try {
    const { name, age, gender, phone, password, abhaId } = req.body;

    const existing = await Patient.findOne({ phone });
    if (existing) {
      return res.status(400).json({ error: "Phone number already registered" });
    }

    // Generate PT-XXXXX string
    const count = await Patient.countDocuments();
    const patientIdStr = `PT-${42945 + count}`;

    const hashedPassword = await bcrypt.hash(password, 10);
    const patient = await Patient.create({
      patientIdStr,
      name,
      age,
      gender,
      phone,
      password: hashedPassword,
      abhaId,
    });

    res.json({ message: "Registration successful", patientIdStr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    const patient = await Patient.findOne({ phone });
    if (!patient || !patient.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: patient._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // Don't send password back
    const patientObj = patient.toObject();
    delete patientObj.password;

    res.json({ token, patient: patientObj });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
