import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PatientRegistration from "./pages/PatientRegistration";
import Login from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import HospitalSelection from "./pages/HospitalSelection";
import Consent from "./pages/Consent";
import Interview from "./pages/Interview";
import DoctorDashboard from "./pages/DoctorDashboard";
import CaseSummary from "./pages/CaseSummary";
import Reports from "./pages/Reports";
import PastConsultations from "./pages/PastConsultations";
import DoctorLogin from "./pages/DoctorLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<PatientRegistration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/case-summary" element={<CaseSummary />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/past-consultations" element={<PastConsultations />} />
        <Route path="/hospital-selection" element={<HospitalSelection />} />
        <Route path="/consent" element={<Consent />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
