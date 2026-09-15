import mongoose, { Schema, Document } from "mongoose";

export interface IMedicalDocument extends Document {
  patientId: mongoose.Types.ObjectId;
  sessionId?: mongoose.Types.ObjectId;
  fileUrl: string;
  fileName: string;
  extractionStatus: "pending" | "completed" | "failed";
  extractedData: any;
  uploadedAt: Date;
}

const MedicalDocumentSchema: Schema = new Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "ClinicalSession" },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  extractionStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  extractedData: { type: Schema.Types.Mixed, default: {} },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMedicalDocument>(
  "MedicalDocument",
  MedicalDocumentSchema,
);
