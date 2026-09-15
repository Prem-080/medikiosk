import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Leaf,
  LockKeyhole,
  Volume2,
} from "lucide-react";

export default function Consent() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const playAudio = () =>
    window.speechSynthesis.speak(
      new SpeechSynthesisUtterance(
        "We will ask a few questions about your health. Your answers will be organised for your practitioner before your consultation.",
      ),
    );
  return (
    <main className="min-h-screen bg-[#f7f8f5] p-5 sm:p-10">
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-[#dfe6dc] bg-white p-7 shadow-[0_20px_60px_-42px_rgba(20,55,40,.35)] sm:p-11">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="grid size-9 place-items-center rounded-xl bg-[#164d3c] text-[#e8f0d5]">
                <Leaf size={18} />
              </span>{" "}
              medikiosk
            </div>
            <p className="mt-10 text-sm font-semibold text-[#397152]">
              BEFORE WE BEGIN
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-.04em]">
              Your consent matters.
            </h1>
          </div>
          <button
            onClick={playAudio}
            className="grid size-11 place-items-center rounded-xl border border-[#d8e2d5] text-[#397152] hover:bg-[#eef5ec]"
            aria-label="Listen to consent"
          >
            <Volume2 size={20} />
          </button>
        </div>
        <p className="mt-5 max-w-2xl leading-8 text-slate-600">
          Medikiosk will guide you through questions about your symptoms and
          wellbeing. Your answers and documents are organised for the
          practitioner you selected; your practitioner remains responsible for
          assessment and treatment.
        </p>
        <div className="mt-8 space-y-3">
          {[
            "You may pause or stop case-taking at any time.",
            "Your answers are used to prepare this consultation.",
            "Medikiosk does not make a diagnosis or treatment decision.",
          ].map((text) => (
            <p
              key={text}
              className="flex gap-3 rounded-xl bg-[#f7f8f5] p-4 text-sm leading-6 text-slate-600"
            >
              <CheckCircle2
                className="mt-0.5 shrink-0 text-[#5f8e67]"
                size={18}
              />
              {text}
            </p>
          ))}
        </div>
        <label className="mt-7 flex cursor-pointer gap-4 rounded-2xl border border-[#dfe6dc] p-5 transition hover:border-[#9bb89e]">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 size-5 accent-[#164d3c]"
          />
          <span>
            <span className="block font-semibold">
              I consent to this pre-consultation case-taking.
            </span>
            <span className="mt-1 block text-sm leading-6 text-slate-500">
              I understand that my responses will be shared with my selected
              practitioner for this consultation.
            </span>
          </span>
        </label>
        <div className="mt-8 flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
          <span className="flex items-center gap-2 text-xs text-slate-500">
            <LockKeyhole size={14} /> Secure patient information
          </span>
          <button
            disabled={!agreed}
            onClick={() => navigate("/interview")}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#164d3c] px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Start guided case-taking <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </main>
  );
}
