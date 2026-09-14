import { Router } from 'express';

const router = Router();

// Deliberately small demo directory for the internal-round prototype.
const DEMO_DOCTOR = {
  doctorId: 'DR-1001',
  password: 'doctor123',
  name: 'Dr. Priya Sharma',
  specialty: 'Ayurveda',
  hospitalName: 'Medikiosk Central Clinic'
};

router.post('/login', (req, res) => {
  const { doctorId, password, hospitalName } = req.body;
  if (doctorId?.trim().toUpperCase() !== DEMO_DOCTOR.doctorId || password !== DEMO_DOCTOR.password || hospitalName !== DEMO_DOCTOR.hospitalName) {
    return res.status(401).json({ error: 'Invalid hospital, doctor ID, or password' });
  }
  res.json({ doctor: { doctorId: DEMO_DOCTOR.doctorId, name: DEMO_DOCTOR.name, specialty: DEMO_DOCTOR.specialty, hospitalName: DEMO_DOCTOR.hospitalName } });
});

export default router;
