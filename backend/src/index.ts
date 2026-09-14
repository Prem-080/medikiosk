import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medikiosk';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

import authRoutes from './routes/auth.js';
import sessionRoutes from './routes/session.js';
import documentRoutes from './routes/documents.js';
import doctorRoutes from './routes/doctor.js';
import doctorAuthRoutes from './routes/doctorAuth.js';

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/doctor-auth', doctorAuthRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MediKiosk API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
