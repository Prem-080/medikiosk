import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  HeartPulse,
  Leaf,
  LockKeyhole,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { api } from "../services/api";

export default function PatientRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    password: "",
    abhaId: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const update = (field: keyof typeof formData, value: string) =>
    setFormData((current) => ({ ...current, [field]: value }));
  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await api.register({ ...formData, age: parseInt(formData.age, 10) });
      navigate("/login");
    } catch (err: any) {
      setError(
        err.message ||
          "We could not create your patient account. Please try again.",
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
              CREATE YOUR PATIENT PROFILE
            </p>
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-.045em]">
              Your story deserves more time in the consultation.
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/75">
              Create your secure patient profile once. Then use it to complete
              guided case-taking before each appointment.
            </p>
            <div className="mt-10 space-y-4">
              {[
                {
                  icon: HeartPulse,
                  text: "Share your symptoms in your own words",
                },
                {
                  icon: ShieldCheck,
                  text: "Keep reports ready for your practitioner",
                },
                {
                  icon: CalendarDays,
                  text: "Save time when you arrive for care",
                },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 text-sm text-white/80"
                >
                  <span className="grid size-9 place-items-center rounded-xl bg-white/10 text-[#c1d9ae]">
                    <Icon size={17} />
                  </span>
                  {text}
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-3 text-sm text-white/75">
            <ShieldCheck size={18} className="text-[#c1d9ae]" />{" "}
            Practitioner-led care, supported by preparation.
          </div>
          <div className="absolute -bottom-28 -right-24 size-96 rounded-full border border-white/10" />
          <div className="absolute bottom-24 right-20 size-52 rounded-full border border-white/10" />
        </section>
        <section className="flex flex-col px-6 py-8 sm:px-12 sm:py-12 lg:px-20">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold lg:hidden"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-[#164d3c] text-[#e8f0d5]">
                <Leaf size={18} />
              </span>{" "}
              medikiosk
            </Link>
            <Link
              to="/"
              className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-[#397152]"
            >
              <ChevronLeft size={16} /> Back home
            </Link>
          </div>
          <div className="mx-auto my-auto w-full max-w-xl py-8">
            <p className="text-sm font-semibold text-[#397152]">
              PATIENT REGISTRATION
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-.04em]">
              Let’s get you ready for care.
            </h2>
            <p className="mt-3 leading-7 text-slate-500">
              Enter a few details to create your Medikiosk patient account.
            </p>
            {error && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}
            <form
              onSubmit={handleNext}
              className="mt-8 grid gap-5 sm:grid-cols-2"
            >
              <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                Full name
                <div className="relative mt-2">
                  <UserRound
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-200 bg-[#fafbf9] py-3.5 pl-11 pr-4 outline-none transition placeholder:text-slate-400 focus:border-[#397152] focus:ring-4 focus:ring-[#397152]/10"
                  />
                </div>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Age
                <input
                  required
                  min="0"
                  max="130"
                  type="number"
                  value={formData.age}
                  onChange={(e) => update("age", e.target.value)}
                  placeholder="Your age"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-[#fafbf9] px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-[#397152] focus:ring-4 focus:ring-[#397152]/10"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Gender
                <select
                  value={formData.gender}
                  onChange={(e) => update("gender", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-[#fafbf9] px-4 py-3.5 outline-none transition focus:border-[#397152] focus:ring-4 focus:ring-[#397152]/10"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                Phone number
                <div className="relative mt-2">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="e.g. 98765 43210"
                    className="w-full rounded-xl border border-slate-200 bg-[#fafbf9] py-3.5 pl-11 pr-4 outline-none transition placeholder:text-slate-400 focus:border-[#397152] focus:ring-4 focus:ring-[#397152]/10"
                  />
                </div>
              </label>
              <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                Create password
                <div className="relative mt-2">
                  <LockKeyhole
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    required
                    minLength={6}
                    type="password"
                    value={formData.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-slate-200 bg-[#fafbf9] py-3.5 pl-11 pr-4 outline-none transition placeholder:text-slate-400 focus:border-[#397152] focus:ring-4 focus:ring-[#397152]/10"
                  />
                </div>
              </label>
              <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                ABHA ID{" "}
                <span className="font-normal text-slate-400">(optional)</span>
                <input
                  value={formData.abhaId}
                  onChange={(e) => update("abhaId", e.target.value)}
                  placeholder="91-xxxx-xxxx-xxxx"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-[#fafbf9] px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-[#397152] focus:ring-4 focus:ring-[#397152]/10"
                />
              </label>
              <button
                disabled={isLoading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#164d3c] px-5 py-3.5 font-semibold text-white transition hover:bg-[#103e30] disabled:opacity-70 sm:col-span-2"
              >
                {isLoading ? (
                  "Creating your account…"
                ) : (
                  <>
                    Create patient account <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#397152] hover:underline"
              >
                Sign in as a patient
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
