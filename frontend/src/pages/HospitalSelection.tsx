import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, UserCircle2, ArrowRight, QrCode } from "lucide-react";

export default function HospitalSelection() {
  const navigate = useNavigate();
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [mode, setMode] = useState<"manual" | "qr">("manual");

  const hospitals = [
    { id: "H01", name: "Ayush National Hospital, Delhi" },
    { id: "H02", name: "Medikiosk Central Clinic" },
    { id: "H03", name: "Vedic Care Center" },
  ];

  const doctors = [
    { id: "DR-1001", name: "Dr. Priya Sharma (Ayurveda)" },
    { id: "D02", name: "Dr. Rajesh Kumar (General)" },
    { id: "D03", name: "Dr. Anita Desai (Panchakarma)" },
  ];

  const handleProceed = () => {
    if (selectedHospital && selectedDoctor) {
      // Pass this to the next screen or save in localStorage for API usage
      localStorage.setItem("selectedHospital", selectedHospital);
      localStorage.setItem("selectedDoctor", selectedDoctor);
      navigate("/consent");
    }
  };

  const handleQRMock = () => {
    setSelectedHospital("Medikiosk Central Clinic");
    setSelectedDoctor("Dr. Priya Sharma (Ayurveda)");
    setMode("manual");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <h2 className="text-3xl font-serif font-bold text-slate-800 mb-2">
          Consultation Details
        </h2>
        <p className="text-slate-500 mb-8">
          Select the hospital and doctor you are visiting today.
        </p>

        <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
          <button
            onClick={() => setMode("manual")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "manual" ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"}`}
          >
            Manual Select
          </button>
          <button
            onClick={() => setMode("qr")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "qr" ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"}`}
          >
            Scan QR
          </button>
        </div>

        {mode === "manual" ? (
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-slate-700 mb-2 font-medium">
                <Building2 size={18} className="text-primary" /> Hospital /
                Clinic
              </label>
              <select
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
              >
                <option value="" disabled>
                  Select Hospital
                </option>
                {hospitals.map((h) => (
                  <option key={h.id} value={h.name}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-slate-700 mb-2 font-medium">
                <UserCircle2 size={18} className="text-primary" /> Doctor
              </label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                disabled={!selectedHospital}
              >
                <option value="" disabled>
                  Select Doctor
                </option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleProceed}
              disabled={!selectedHospital || !selectedDoctor}
              className="w-full bg-primary text-white p-4 rounded-xl text-lg font-medium hover:bg-primary-dark transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              Continue <ArrowRight size={20} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <div
              className="w-48 h-48 border-2 border-dashed border-primary/50 rounded-2xl flex flex-col items-center justify-center bg-primary/5 text-primary mb-6 cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={handleQRMock}
            >
              <QrCode size={48} className="mb-2" />
              <span className="text-sm font-medium">
                Click to simulate scan
              </span>
            </div>
            <p className="text-center text-slate-500">
              Scan the Medikiosk QR code displayed at the reception desk.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
