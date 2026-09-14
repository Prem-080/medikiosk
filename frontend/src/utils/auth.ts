const SESSION_COOKIE = 'medikiosk_patient_session';

export function hasPatientSession() {
  return Boolean(localStorage.getItem('token') && localStorage.getItem('patientId')) || document.cookie.includes(`${SESSION_COOKIE}=active`);
}

export function storePatientSession() {
  document.cookie = `${SESSION_COOKIE}=active; path=/; max-age=86400; SameSite=Lax`;
}

export function clearPatientSession() {
  localStorage.clear();
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
