# MediKiosk

An AI Clinical History & Pre-Consultation Platform built for the Smart India Hackathon (SIH).

## Project Overview
MediKiosk addresses the problem of limited consultation time in high-volume Indian hospital OPDs. It provides a kiosk-friendly patient intake interface that adaptively collects the clinical history using AI, processes uploaded medical documents using OCR, and presents a structured physician-ready timeline to the doctor before the consultation even begins.

## Features
- **Adaptive AI Clinical Interview:** Dynamically asks follow-up questions based on the patient's chief complaint.
- **Voice/Text Support:** Accessible for elderly and low-literacy users.
- **OCR Medical Extraction:** Extracts lab values (with normal/high reference ranges) and medications from uploaded documents.
- **Red Flag Detection:** Instantly alerts the physician of emergency symptoms (e.g., "Severe chest pain + shortness of breath").
- **Physician Dashboard:** A comprehensive, structured timeline of the patient's history and documents, drastically reducing consultation time.

## Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, React Router DOM.
- **Backend:** Node.js, Express, TypeScript, Mongoose.
- **Database:** MongoDB.
- **Services (Mocked for Prototype):** LLM AI Service, OCR Service, ABHA Service.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://127.0.0.1:27017/medikiosk`)

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend will run on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173` (or the port specified by Vite).

## Demo Flow Walkthrough
1. Go to the frontend URL (e.g. `http://localhost:5173`).
2. Click **"Use Demo Patient"** (Loads Ravi Kumar, 52M).
3. Review and accept the Consent terms.
4. Go through the **AI Clinical Interview**. You can type or use the microphone button to simulate voice input.
5. Watch the AI adaptively ask follow-up questions. Wait for the final "Thank you" message.
6. Click **"Upload Documents"**. Click the upload zone to simulate an OCR extraction of a lab report.
7. Click **"Finish & Go to Doctor Dashboard"**.
8. On the **Doctor Dashboard**, you will see the patient in the queue with a **RED FLAG**.
9. Click on the patient to see the structured AI history, red flags, and the extracted OCR lab values side-by-side.

## Mock Integrations
- **AI Service:** `backend/src/services/MockAIService.ts`
- **OCR Service:** `backend/src/services/MockOCRService.ts`

These abstractions are designed so they can be replaced by real LLM API calls (e.g. Gemini/GPT) and AWS Textract / Azure Form Recognizer in production.
