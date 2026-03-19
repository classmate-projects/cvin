"use client";

import { useState, useEffect } from "react";
import UploadResume from "@/components/UploadResume";
import Link from "next/link";
import { BackArrowIcon, FileAddIcon } from "@/lib/icons";
import { FiCpu, FiShield, FiUploadCloud } from "react-icons/fi";

export default function UploadPage() {
  const [aiStatus, setAiStatus] = useState({ checked: false, online: true });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/status/ai");
        const data = await res.json();
        setAiStatus({ checked: true, online: data.online });
      } catch (err) {
        setAiStatus({ checked: true, online: false });
      }
    };
    checkStatus();
  }, []);

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-700 mt-3">
      {/* Central Upload Component Unit */}
      <div className="card-glass p-6 sm:p-16 bg-white dark:bg-[#151515] space-y-8 sm:space-y-12 relative overflow-hidden transition-colors">
        {/* Modern Decorative Element */}
        <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-[0.03] dark:opacity-[0.02] group-hover:opacity-[0.08] dark:group-hover:opacity-[0.05] transition-opacity pointer-events-none">
          <FiUploadCloud className="text-[120px] sm:text-[200px] text-[#00845a] dark:text-white" />
        </div>

        {!file && (
            <div className="text-center relative z-10 transition-colors">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter transition-colors">
            Import Candidate Profile
          </h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 font-medium max-w-lg mx-auto leading-relaxed transition-colors">
            Supporting native{" "}
            <span className="text-slate-900 dark:text-white font-black">
              PDF
            </span>{" "}
            and{" "}
            <span className="text-slate-900 dark:text-white font-black">
              DOCX
            </span>{" "}
            formats.
          </p>
        </div>
        )}

        <div className="relative z-20">
          <UploadResume file={file} setFile={setFile} />
        </div>
      </div>
    </div>
  );
}

function USPItem({ icon, title, desc, color }) {
  return (
    <div className="card-glass p-8 bg-white/60 dark:bg-[#1a1a1a]/60 hover:bg-white dark:hover:bg-[#1a1a1a] transition-all border-slate-100/50 dark:border-white/5">
      <div className={`text-2xl mb-4 transition-colors ${color}`}>{icon}</div>
      <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest mb-2 px-1 border-l-2 border-slate-200 dark:border-white/20 transition-colors">
        {title}
      </h4>
      <p className="text-xs text-slate-400 dark:text-gray-500 font-medium leading-relaxed transition-colors">
        {desc}
      </p>
    </div>
  );
}
