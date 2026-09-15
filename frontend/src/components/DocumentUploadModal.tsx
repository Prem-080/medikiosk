import { useRef, useState } from "react";
import { CheckCircle2, FileText, UploadCloud, X } from "lucide-react";
import { api } from "../services/api";

type Status = "idle" | "uploading" | "processing" | "done" | "error";

export default function DocumentUploadModal({
  open,
  onClose,
  onUploaded,
}: {
  open: boolean;
  onClose: () => void;
  onUploaded?: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  if (!open) return null;
  const upload = async (name = "Demo_Prescription.jpg") => {
    const patientId = localStorage.getItem("patientId");
    if (!patientId) {
      setStatus("error");
      return;
    }
    setFileName(name);
    setStatus("uploading");
    try {
      await api.uploadDocument(patientId, "mock-url", name);
      setStatus("processing");
      setTimeout(() => {
        setStatus("done");
        onUploaded?.();
      }, 1000);
    } catch {
      setStatus("error");
    }
  };
  const close = () => {
    if (status === "uploading" || status === "processing") return;
    setStatus("idle");
    setFileName("");
    onClose();
  };
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-title"
      className="fixed inset-0 z-50 grid place-items-center bg-[#132119]/45 p-5"
      onMouseDown={close}
    >
      <section
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[.15em] text-[#397152]">
              YOUR HEALTH RECORDS
            </p>
            <h2
              id="upload-title"
              className="mt-2 text-2xl font-semibold tracking-[-.03em]"
            >
              Add a document
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Prescriptions, lab reports, scans or discharge summaries.
            </p>
          </div>
          <button
            onClick={close}
            disabled={status === "uploading" || status === "processing"}
            aria-label="Close upload window"
            className="grid size-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) upload(file.name);
          }}
        />
        {status === "idle" && (
          <button
            onClick={() => inputRef.current?.click()}
            className="mt-7 grid w-full place-items-center rounded-2xl border-2 border-dashed border-[#c9dac8] bg-[#f8fbf7] px-6 py-11 text-center transition hover:border-[#5f8e67] hover:bg-[#f1f7ef]"
          >
            <span className="grid size-13 place-items-center rounded-2xl bg-[#e4f0e3] text-[#397152]">
              <UploadCloud size={26} />
            </span>
            <span className="mt-4 font-semibold">Choose a file to upload</span>
            <span className="mt-1 text-sm text-slate-500">PNG, JPG or PDF</span>
          </button>
        )}
        {status === "idle" && (
          <button
            onClick={() => upload()}
            className="mt-4 w-full text-sm font-semibold text-[#397152] hover:underline"
          >
            Use a demo prescription instead
          </button>
        )}
        {(status === "uploading" || status === "processing") && (
          <div className="mt-8 grid place-items-center py-12 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-[#eaf3e9] text-[#397152] animate-pulse">
              <UploadCloud size={27} />
            </span>
            <h3 className="mt-5 text-lg font-semibold">
              {status === "uploading"
                ? "Adding your document…"
                : "Organising document details…"}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              This will only take a moment.
            </p>
          </div>
        )}
        {status === "done" && (
          <div className="mt-7 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#eaf3e9] text-[#397152]">
              <CheckCircle2 size={28} />
            </span>
            <h3 className="mt-5 text-lg font-semibold">Document added</h3>
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#f7f8f5] p-4 text-left">
              <FileText className="text-red-500" size={21} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{fileName}</p>
                <p className="text-xs text-slate-500">
                  Ready for practitioner review
                </p>
              </div>
            </div>
            <button
              onClick={close}
              className="mt-6 rounded-full bg-[#164d3c] px-5 py-3 text-sm font-semibold text-white"
            >
              Done
            </button>
          </div>
        )}
        {status === "error" && (
          <div className="mt-7 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            We couldn’t upload that document. Please sign in and try again.
          </div>
        )}
      </section>
    </div>
  );
}
