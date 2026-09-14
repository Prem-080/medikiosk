import mongoose, { Schema, Document } from 'mongoose';

export interface IClinicalSession extends Document {
  patientId: mongoose.Types.ObjectId;
  hospitalName?: string;
  doctorId?: string;
  status: 'active' | 'completed' | 'reviewed';
  redFlags: string[];
  conversation: { role: 'ai' | 'patient', content: string, timestamp: Date }[];
  history: {
    chiefComplaint?: string;
    hpi?: any;
    pastMedical?: string[];
    medications?: string[];
    allergies?: string[];
    // Ayush Specific Fields
    prakriti?: string;
    vikriti?: string;
    agni?: string;
    koshtha?: string;
    nidana?: string;
    dashavidhaPariksha?: {
      sara?: string;
      samhanana?: string;
      pramana?: string;
    };
    lifestyle?: {
      diet?: string;
      sleep?: string;
    };
  };
  practitionerReview?: {
    verified: boolean;
    intakeValidated?: boolean;
    intakeValidatedAt?: Date;
    assessment?: string;
    plan?: string;
    followUpDate?: Date;
    reviewedAt?: Date;
  };
  createdAt: Date;
}

const ClinicalSessionSchema: Schema = new Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  hospitalName: { type: String },
  doctorId: { type: String },
  status: { type: String, enum: ['active', 'completed', 'reviewed'], default: 'active' },
  redFlags: [{ type: String }],
  conversation: [{
    role: { type: String, enum: ['ai', 'patient'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  history: { type: Schema.Types.Mixed, default: {} },
  practitionerReview: {
    verified: { type: Boolean, default: false },
    intakeValidated: { type: Boolean, default: false },
    intakeValidatedAt: { type: Date },
    assessment: { type: String },
    plan: { type: String },
    followUpDate: { type: Date },
    reviewedAt: { type: Date }
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IClinicalSession>('ClinicalSession', ClinicalSessionSchema);
