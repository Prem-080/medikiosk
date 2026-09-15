import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  ShieldCheck,
  Phone,
} from "lucide-react";
import { api } from "../services/api";
import { hasPatientSession, storePatientSession } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (hasPatientSession()) navigate("/patient-dashboard", { replace: true });
  }, [navigate]);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const data = await api.login(phone, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("patientId", data.patient._id);
      localStorage.setItem("patientIdStr", data.patient.patientIdStr);
      localStorage.setItem("patientName", data.patient.name);
      storePatientSession();
      navigate("/patient-dashboard");
    } catch (err: any) {
      setError(
        err.message || "We could not sign you in. Please check your details.",
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-[#fcfcfa] p-5 text-[#1c2722] sm:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-[#e4e8e1] bg-white shadow-[0_24px_80px_-45px_rgba(20,55,40,.35)] lg:grid-cols-[.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-[#174d3c] p-12 text-white lg:flex lg:flex-col">
          <Link
            to="/"
            className="relative z-10 flex items-center gap-3 text-xl font-semibold"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-white/10 text-[#dceecb]">
              <Leaf size={21} />
            </span>{" "}
            medikiosk
          </Link>
          <div className="relative z-10 my-auto max-w-md">
            <p className="mb-5 text-xs font-semibold tracking-[.18em] text-[#c1d9ae]">
              PATIENT PORTAL
            </p>
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-.045em]">
              Care begins before the consultation.
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/75">
              A private space to complete your Ayush case-taking, store reports
              and prepare for your appointment.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-3 text-sm text-white/75">
            <ShieldCheck size={18} className="text-[#c1d9ae]" /> Your case is
            prepared for practitioner review.
          </div>
          <div className="absolute -bottom-28 -right-24 size-96 rounded-full border border-white/10" />
          <div className="absolute bottom-24 right-20 size-52 rounded-full border border-white/10" />
        </section>
        <section className="flex flex-col px-6 py-8 sm:px-12 sm:py-12 lg:px-20">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold lg:hidden"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-[#164d3c] text-[#e8f0d5]">
              <Leaf size={18} />
            </span>{" "}
            medikiosk
          </Link>
          <div className="mx-auto my-auto w-full max-w-md">
            <p className="text-sm font-semibold text-[#397152]">WELCOME BACK</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-.04em]">
              Sign in as a patient
            </h2>
            <p className="mt-3 leading-7 text-slate-500">
              Use your registered phone number to access your care dashboard.
            </p>
            {error && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <label className="block text-sm font-medium text-slate-700">
                Phone number
                <div className="relative mt-2">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full rounded-xl border border-slate-200 bg-[#fafbf9] py-3.5 pl-11 pr-4 outline-none transition placeholder:text-slate-400 focus:border-[#397152] focus:ring-4 focus:ring-[#397152]/10"
                  />
                </div>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Password
                <div className="relative mt-2">
                  <LockKeyhole
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-[#fafbf9] py-3.5 pl-11 pr-12 outline-none transition placeholder:text-slate-400 focus:border-[#397152] focus:ring-4 focus:ring-[#397152]/10"
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>
              <div className="flex justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-500">
                  <input type="checkbox" className="accent-[#164d3c]" />{" "}
                  Remember me
                </label>
                <button
                  type="button"
                  className="font-medium text-[#397152] hover:underline"
                >
                  Need help?
                </button>
              </div>
              <button
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#164d3c] px-5 py-3.5 font-semibold text-white transition hover:bg-[#103e30] disabled:opacity-70"
              >
                {isLoading ? (
                  "Signing in…"
                ) : (
                  <>
                    Sign in to my dashboard <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
            <p className="mt-8 text-center text-sm text-slate-500">
              New to Medikiosk?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#397152] hover:underline"
              >
                Create a patient account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
