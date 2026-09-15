import { useEffect, useState } from "react";
import { FileText, Plus, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PatientShell from "../components/PatientShell";
import { api } from "../services/api";
import type { MedicalDocument } from "../types";
import DocumentUploadModal from "../components/DocumentUploadModal";

export default function Reports() {
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selected, setSelected] = useState<MedicalDocument | null>(null);
  const navigate = useNavigate();
  const load = () => {
    const id = localStorage.getItem("patientId");
    if (!id) {
      navigate("/login");
      return;
    }
    api
      .getPatientDocuments(id)
      .then((data) => setDocuments(data.documents || []))
      .catch(() => setDocuments([]));
  };
  useEffect(() => {
    load();
  }, [navigate]);
  return (
    <PatientShell title="Reports & documents">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[#397152]">
            YOUR HEALTH RECORDS
          </p>
          <h2 className="mt-2 text-4xl font-semibold tracking-[-.04em]">
            Reports & documents
          </h2>
          <p className="mt-3 text-slate-600">
            Click any document to review its details and extracted information.
          </p>
        </div>
        <button
          onClick={() => setUploadOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#164d3c] px-5 py-3 font-semibold text-white"
        >
          <Plus size={18} /> Add a report
        </button>
      </div>
      {documents.length === 0 ? (
        <Empty onUpload={() => setUploadOpen(true)} />
      ) : (
        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {documents.map((document) => (
            <button
              key={document._id}
              onClick={() => setSelected(document)}
              className="flex items-center gap-4 rounded-2xl border border-[#dfe6dc] bg-white p-5 text-left transition hover:border-[#9bb89e] hover:shadow-sm"
            >
              <span className="grid size-12 place-items-center rounded-xl bg-red-50 text-red-500">
                <FileText size={21} />
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{document.fileName}</p>
                <p className="mt-1 text-sm text-slate-500">
                  Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </button>
          ))}
        </section>
      )}
      <DocumentUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={load}
      />
      {selected && (
        <DocumentViewer document={selected} onClose={() => setSelected(null)} />
      )}
    </PatientShell>
  );
}
function Empty({ onUpload }: { onUpload: () => void }) {
  return (
    <section className="mt-8 grid min-h-[380px] place-items-center rounded-3xl border border-dashed border-[#d8e2d5] bg-white p-8 text-center">
      <div>
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#eef5ec] text-[#397152]">
          <Upload size={26} />
        </span>
        <h3 className="mt-5 text-2xl font-semibold">No reports added yet.</h3>
        <p className="mx-auto mt-3 max-w-md leading-7 text-slate-500">
          Upload a prescription, lab report, scan or discharge summary to keep
          it with your case.
        </p>
        <button
          onClick={onUpload}
          className="mt-7 inline-flex items-center gap-2 font-semibold text-[#397152] hover:underline"
        >
          Upload your first document <Plus size={16} />
        </button>
      </div>
    </section>
  );
}
function DocumentViewer({
  document,
  onClose,
}: {
  document: MedicalDocument;
  onClose: () => void;
}) {
  const data = document.extractedData || {};
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-[#132119]/45 p-5"
      onMouseDown={onClose}
    >
      <section
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-red-50 text-red-500">
              <FileText size={21} />
            </span>
            <div>
              <p className="text-xs font-semibold tracking-[.14em] text-[#397152]">
                DOCUMENT DETAILS
              </p>
              <h3 className="mt-1 break-all text-xl font-semibold">
                {document.fileName}
              </h3>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close document viewer">
            <X size={20} />
          </button>
        </div>
        <div className="mt-7 rounded-2xl bg-[#f7f8f5] p-5">
          <p className="text-xs font-semibold tracking-[.12em] text-slate-400">
            UPLOADED
          </p>
          <p className="mt-2 text-sm">
            {new Date(document.uploadedAt).toLocaleString()}
          </p>
          <p className="mt-5 text-xs font-semibold tracking-[.12em] text-slate-400">
            PROCESSING STATUS
          </p>
          <p className="mt-2 text-sm capitalize">{document.extractionStatus}</p>
        </div>
        <div className="mt-5">
          <p className="text-xs font-semibold tracking-[.12em] text-slate-400">
            EXTRACTED INFORMATION
          </p>
          <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-xl bg-[#f7f8f5] p-4 text-sm leading-6 text-slate-600">
            {Object.keys(data).length
              ? JSON.stringify(data, null, 2)
              : "No extracted information available yet."}
          </pre>
        </div>
        <button
          onClick={onClose}
          className="mt-6 rounded-full bg-[#164d3c] px-5 py-3 text-sm font-semibold text-white"
        >
          Done
        </button>
      </section>
    </div>
  );
}
