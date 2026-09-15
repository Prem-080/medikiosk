const DOCTOR_KEY = "medikiosk_doctor";

export type DoctorSession = {
  doctorId: string;
  name: string;
  specialty: string;
  hospitalName: string;
};

export function getDoctorSession(): DoctorSession | null {
  try {
    return JSON.parse(localStorage.getItem(DOCTOR_KEY) || "null");
  } catch {
    return null;
  }
}

export function storeDoctorSession(doctor: DoctorSession) {
  localStorage.setItem(DOCTOR_KEY, JSON.stringify(doctor));
  document.cookie =
    "medikiosk_doctor_session=active; path=/; max-age=86400; SameSite=Lax";
}

export function clearDoctorSession() {
  localStorage.removeItem(DOCTOR_KEY);
  document.cookie =
    "medikiosk_doctor_session=; path=/; max-age=0; SameSite=Lax";
}
