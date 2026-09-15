export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  abhaId?: string;
  createdAt: string;
}

export interface ClinicalSession {
  _id: string;
  patientId: string;
  status: "active" | "completed" | "reviewed";
  redFlags: string[];
  conversation: {
    role: "ai" | "patient";
    content: string;
    timestamp: string;
  }[];
  history: {
    chiefComplaint?: string;
    hpi?: any;
    pastMedical?: string[];
    medications?: string[];
    allergies?: string[];
    ayushHistory?: any;
  };
  createdAt: string;
}

export interface MedicalDocument {
  _id: string;
  patientId: string;
  sessionId?: string;
  fileUrl: string;
  fileName: string;
  extractionStatus: "pending" | "completed" | "failed";
  extractedData: any;
  uploadedAt: string;
}

export const _dummy = true;
