const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  login: async (patientIdStr: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientIdStr: patientIdStr.trim().toUpperCase(), password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  register: async (data: any) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  startSession: async (patientId: string, hospitalName?: string, doctorId?: string) => {
    const res = await fetch(`${API_URL}/sessions/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, hospitalName, doctorId })
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  },

  getPatientSessions: async (patientId: string) => {
    const res = await fetch(`${API_URL}/sessions/patient/${patientId}`);
    if (!res.ok) throw new Error('Could not load your consultations');
    return res.json();
  },

  updatePatientIntake: async (sessionId: string, chiefComplaint: string) => {
    const res = await fetch(`${API_URL}/sessions/${sessionId}/patient-intake`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chiefComplaint }) });
    if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Could not update consultation'); }
    return res.json();
  },

  deletePatientSession: async (sessionId: string) => {
    const res = await fetch(`${API_URL}/sessions/${sessionId}`, { method: 'DELETE' });
    if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Could not delete consultation'); }
    return res.json();
  },
  
  sendChatMessage: async (sessionId: string, message: string) => {
    const res = await fetch(`${API_URL}/sessions/${sessionId}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  },
  
  uploadDocument: async (patientId: string, fileUrl: string, fileName: string) => {
    const res = await fetch(`${API_URL}/documents/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, fileUrl, fileName })
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  },

  getPatientDocuments: async (patientId: string) => {
    const res = await fetch(`${API_URL}/documents/patient/${patientId}`);
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  },

  doctorLogin: async (doctorId: string, password: string, hospitalName: string) => {
    const res = await fetch(`${API_URL}/doctor-auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ doctorId, password, hospitalName }) });
    if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Doctor login failed'); }
    return res.json();
  },

  getDoctorQueue: async (hospitalName?: string, doctorId?: string) => {
    const params = new URLSearchParams(); if (hospitalName) params.set('hospitalName', hospitalName); if (doctorId) params.set('doctorId', doctorId);
    const res = await fetch(`${API_URL}/doctor/queue?${params.toString()}`);
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  },

  getCaseDetails: async (sessionId: string) => {
    const res = await fetch(`${API_URL}/doctor/case/${sessionId}`);
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  },

  validatePatientIntake: async (sessionId: string) => {
    const res = await fetch(`${API_URL}/doctor/case/${sessionId}/validate-intake`, { method: 'POST' });
    if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Could not validate intake'); }
    return res.json();
  },

  finalizeConsultation: async (sessionId: string, data: { assessment: string; plan: string; followUpDate?: string }) => {
    const res = await fetch(`${API_URL}/doctor/case/${sessionId}/finalize`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Could not finalise consultation'); }
    return res.json();
  },

  sendCaseToAbha: async (sessionId: string) => {
    const res = await fetch(`${API_URL}/doctor/case/${sessionId}/send-to-abha`, { method: 'POST' });
    if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Could not prepare ABHA sharing'); }
    return res.json();
  }
};
