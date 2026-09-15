import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bot, FileUp, Leaf, Mic, Send, Square } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import type { ClinicalSession } from "../types";
import DocumentUploadModal from "../components/DocumentUploadModal";

export default function Interview() {
  const [session, setSession] = useState<ClinicalSession | null>(null);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const patientId = localStorage.getItem("patientId");
    if (!patientId) {
      navigate("/login");
      return;
    }
    setLoading(true);
    api
      .startSession(
        patientId,
        localStorage.getItem("selectedHospital") || undefined,
        localStorage.getItem("selectedDoctor") || undefined,
      )
      .then((data) => setSession(data.session))
      .finally(() => setLoading(false));
  }, [navigate]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.conversation, loading]);
  const send = async () => {
    if (!input.trim() || !session || loading) return;
    const answer = input.trim();
    setInput("");
    setSession((value) =>
      value
        ? {
            ...value,
            conversation: [
              ...value.conversation,
              {
                role: "patient",
                content: answer,
                timestamp: new Date().toISOString(),
              },
            ],
          }
        : value,
    );
    setLoading(true);
    try {
      const data = await api.sendChatMessage(session._id, answer);
      setSession(data.session);
    } finally {
      setLoading(false);
    }
  };
  if (!session)
    return (
      <div className="grid min-h-screen place-items-center bg-[#f7f8f5] text-[#397152]">
        <div className="text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#eaf3e9]">
            <Bot size={23} />
          </span>
          <p className="mt-4 font-semibold">
            Preparing your guided case-taking…
          </p>
        </div>
      </div>
    );
  const done = session.status === "completed";
  const answers = session.conversation.filter(
    (message) => message.role === "patient",
  ).length;
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#1c2722]">
      <header className="border-b border-[#dfe6dc] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          <button
            onClick={() => navigate("/patient-dashboard")}
            className="flex items-center gap-3 text-xl font-semibold"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-[#164d3c] text-[#e8f0d5]">
              <Leaf size={20} />
            </span>
            <span className="hidden sm:block">medikiosk</span>
          </button>
          <div className="hidden text-center sm:block">
            <p className="text-sm font-semibold">Guided case-taking</p>
            <p className="text-xs text-slate-500">
              Take your time. Your answers are saved.
            </p>
          </div>
          <button
            onClick={() => setUploadOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-[#d8e2d5] px-3 py-2 text-sm font-semibold text-[#397152] hover:bg-[#eef5ec]"
          >
            <FileUp size={16} />
            <span className="hidden sm:block">Add report</span>
          </button>
        </div>
      </header>
      <div className="mx-auto flex min-h-[calc(100vh-81px)] max-w-5xl flex-col px-5 py-6 sm:px-8">
        <section className="mx-auto w-full max-w-3xl">
          <div className="flex items-center justify-between text-xs font-semibold tracking-[.13em] text-[#397152]">
            <span>YOUR PRE-CONSULTATION CASE</span>
            <span>
              {done ? "COMPLETE" : `STEP ${Math.max(1, answers + 1)} OF 5`}
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#dfe6dc]">
            <div
              className="h-full rounded-full bg-[#66906d] transition-all duration-500"
              style={{ width: `${done ? 100 : Math.max(12, answers * 20)}%` }}
            />
          </div>
        </section>
        {session.redFlags?.length > 0 && (
          <section className="mx-auto mt-5 w-full max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
            <strong>Important:</strong> {session.redFlags.join(" · ")} Please
            tell a member of the clinic team immediately if you need urgent
            help.
          </section>
        )}
        <section className="mx-auto mt-6 flex w-full max-w-3xl flex-1 flex-col overflow-hidden rounded-3xl border border-[#dfe6dc] bg-white shadow-[0_20px_60px_-45px_rgba(20,55,40,.35)]">
          <div className="flex items-center gap-3 border-b border-[#edf0eb] bg-[#fbfcfa] p-5">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#eaf3e9] text-[#397152]">
              <Bot size={20} />
            </span>
            <div>
              <p className="font-semibold">Medikiosk guide</p>
              <p className="text-xs text-slate-500">
                Here to organise your information for your practitioner
              </p>
            </div>
          </div>
          <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-7">
            {session.conversation.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === "patient" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "ai" && (
                  <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-lg bg-[#eaf3e9] text-[#397152]">
                    <Bot size={14} />
                  </span>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3.5 text-[15px] leading-7 ${message.role === "patient" ? "rounded-br-md bg-[#164d3c] text-white" : "rounded-bl-md bg-[#f2f5f1] text-slate-700"}`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <span className="grid size-7 place-items-center rounded-lg bg-[#eaf3e9] text-[#397152]">
                  <Bot size={14} />
                </span>
                <div className="rounded-2xl rounded-bl-md bg-[#f2f5f1] px-4 py-3 text-sm text-slate-500">
                  Thinking…
                </div>
              </div>
            )}
            {done && (
              <div className="rounded-2xl border border-[#cae2c9] bg-[#eef7ed] p-5">
                <p className="font-semibold text-[#315d3b]">
                  Your case-taking is complete.
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Your responses are now organised for practitioner review. You
                  can still add a report if needed.
                </p>
                <button
                  onClick={() => navigate("/case-summary")}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#397152] hover:underline"
                >
                  View my case summary <ArrowRight size={16} />
                </button>
              </div>
            )}
            <div ref={endRef} />
          </div>
          {!done && (
            <div className="border-t border-[#edf0eb] p-4 sm:p-5">
              <div className="flex items-end gap-3">
                <button
                  onClick={() => {
                    setRecording((value) => !value);
                    if (!recording)
                      setTimeout(
                        () =>
                          setInput(
                            (value) =>
                              `${value}${value ? " " : ""}It started about two hours ago.`,
                          ),
                        1200,
                      );
                  }}
                  disabled={loading}
                  aria-label={recording ? "Stop recording" : "Answer by voice"}
                  className={`grid size-12 shrink-0 place-items-center rounded-full ${recording ? "bg-red-500 text-white" : "bg-[#eef5ec] text-[#397152]"} disabled:opacity-50`}
                >
                  {recording ? <Square size={18} /> : <Mic size={19} />}
                </button>
                <div className="flex min-h-12 flex-1 items-center rounded-2xl border border-[#dfe6dc] bg-[#fafbf9] px-3 focus-within:border-[#5f8e67]">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && send()}
                    disabled={loading}
                    placeholder="Type your answer…"
                    className="w-full bg-transparent px-1 py-3 text-sm outline-none placeholder:text-slate-400"
                  />
                  <button
                    onClick={send}
                    disabled={!input.trim() || loading}
                    aria-label="Send answer"
                    className="grid size-9 place-items-center rounded-xl bg-[#164d3c] text-white disabled:opacity-35"
                  >
                    <Send size={17} />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-center text-xs text-slate-400">
                Use the microphone or type your answer. You may pause at any
                time.
              </p>
            </div>
          )}
        </section>
      </div>
      <DocumentUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
      />
    </main>
  );
}
