import mongoose, { Schema, Document } from "mongoose";

export interface IPatient extends Document {
  patientIdStr: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  password?: string;
  abhaId?: string;
  createdAt: Date;
}

const PatientSchema: Schema = new Schema({
  patientIdStr: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String },
  abhaId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPatient>("Patient", PatientSchema);
