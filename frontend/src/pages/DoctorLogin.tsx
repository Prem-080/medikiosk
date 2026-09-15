import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Leaf,
  LockKeyhole,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { api } from "../services/api";
import { getDoctorSession, storeDoctorSession } from "../utils/doctorAuth";

export default function DoctorLogin() {
  const navigate = useNavigate();
  const [hospitalName, setHospitalName] = useState("Medikiosk Central Clinic");
  const [doctorId, setDoctorId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (getDoctorSession()) navigate("/doctor", { replace: true });
  }, [navigate]);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.doctorLogin(
        doctorId.trim().toUpperCase(),
        password,
        hospitalName,
      );
      storeDoctorSession(data.doctor);
      navigate("/doctor");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-[#fcfcfa] p-5 text-[#1c2722] sm:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-[#e4e8e1] bg-white shadow-[0_24px_80px_-45px_rgba(20,55,40,.35)] lg:grid-cols-[.9fr_1.1fr]">
        <section className="hidden bg-[#174d3c] p-12 text-white lg:flex lg:flex-col">
          <Link
            to="/"
            className="flex items-center gap-3 text-xl font-semibold"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-white/10 text-[#dceecb]">
              <Leaf size={21} />
            </span>{" "}
            medikiosk
          </Link>
          <div className="my-auto max-w-md">
            <p className="text-xs font-semibold tracking-[.18em] text-[#c1d9ae]">
              PRACTITIONER PORTAL
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-[-.045em]">
              Prepared cases. More focused consultations.
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/75">
              Review completed pre-consultation cases for your assigned hospital
              and record your practitioner-led plan.
            </p>
          </div>
          <p className="flex items-center gap-2 text-sm text-white/75">
            <Stethoscope size={18} className="text-[#c1d9ae]" /> Demo access for
            the internal round
          </p>
        </section>
        <section className="flex px-6 py-8 sm:px-12 sm:py-12 lg:px-20">
          <div className="m-auto w-full max-w-md">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold lg:hidden"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-[#164d3c] text-[#e8f0d5]">
                <Leaf size={18} />
              </span>{" "}
              medikiosk
            </Link>
            <p className="mt-10 text-sm font-semibold text-[#397152]">
              PRACTITIONER ACCESS
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-.04em]">
              Sign in to your hospital queue.
            </h1>
            <p className="mt-3 leading-7 text-slate-500">
              Use your hospital assignment and doctor ID to review completed
              patient cases.
            </p>
            {error && (
              <p className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}
            <form onSubmit={submit} className="mt-8 space-y-5">
              <label className="block text-sm font-medium">
                Hospital
                <div className="relative mt-2">
                  <Building2
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <select
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-[#fafbf9] py-3.5 pl-11 pr-4 outline-none focus:border-[#397152]"
                  >
                    <option>Medikiosk Central Clinic</option>
                  </select>
                </div>
              </label>
              <label className="block text-sm font-medium">
                Doctor ID
                <div className="relative mt-2">
                  <UserRound
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    required
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    placeholder="e.g. DR-1001"
                    className="w-full rounded-xl border border-slate-200 bg-[#fafbf9] py-3.5 pl-11 pr-4 outline-none focus:border-[#397152]"
                  />
                </div>
              </label>
              <label className="block text-sm font-medium">
                Password
                <div className="relative mt-2">
                  <LockKeyhole
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-[#fafbf9] py-3.5 pl-11 pr-4 outline-none focus:border-[#397152]"
                  />
                </div>
              </label>
              <button
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#164d3c] py-3.5 font-semibold text-white disabled:opacity-60"
              >
                {loading ? (
                  "Signing in…"
                ) : (
                  <>
                    Open practitioner workspace <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
            <div className="mt-7 rounded-2xl bg-[#f2f7ee] p-4 text-sm text-[#315d3b]">
              <p className="font-semibold">Demo credentials</p>
              <p className="mt-1">
                Doctor ID: <strong>DR-1001</strong> · Password:{" "}
                <strong>doctor123</strong>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
