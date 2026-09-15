import type { ReactNode } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  FileText,
  Leaf,
  LogOut,
  Menu,
  Upload,
  X,
} from "lucide-react";
import { clearPatientSession } from "../utils/auth";

const navigation = [
  { label: "Overview", path: "/patient-dashboard", icon: Leaf },
  { label: "My case summary", path: "/case-summary", icon: FileText },
  { label: "Reports & documents", path: "/reports", icon: Upload },
  {
    label: "Past consultations",
    path: "/past-consultations",
    icon: CalendarDays,
  },
];

export default function PatientShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const name = localStorage.getItem("patientName") || "Patient";
  const id = localStorage.getItem("patientIdStr") || "PT-XXXXX";
  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#1c2722]">
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-[#e2e7df] bg-white px-5 py-6 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 text-xl font-semibold"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-[#164d3c] text-[#e8f0d5]">
              <Leaf size={21} />
            </span>
            medikiosk
          </button>
          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="mt-10">
          <p className="px-3 text-xs font-semibold tracking-[.14em] text-slate-400">
            MY CARE
          </p>
          <nav className="mt-3 space-y-1">
            {navigation.map(({ label, path, icon: Icon }) => (
              <button
                key={path}
                onClick={() => {
                  navigate(path);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium ${location.pathname === path ? "bg-[#eaf3e9] text-[#164d3c]" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto rounded-2xl bg-[#f2f7ee] p-4">
          <div className="flex gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-[#164d3c] text-sm font-semibold text-white">
              {name.charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="text-sm font-semibold">{name}</p>
              <p className="text-xs text-slate-500">{id}</p>
            </div>
          </div>
          <button
            onClick={() => {
              clearPatientSession();
              navigate("/login");
            }}
            className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#164d3c]"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
      {open && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-20 bg-slate-900/25 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <main className="min-h-screen lg:ml-72">
        <header className="flex h-20 items-center border-b border-[#e2e7df] bg-white px-5 sm:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu />
          </button>
          <div className="ml-4 lg:ml-0">
            <p className="text-sm text-slate-500">Patient portal</p>
            <h1 className="text-sm font-semibold">{title}</h1>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-11">
          {children}
        </div>
      </main>
    </div>
  );
}
