"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiCompass, FiArrowLeft, FiSearch, FiUploadCloud, FiUsers } from "react-icons/fi";
import { BackArrowIcon } from "@/lib/icons";

const SHORTCUTS = [
  { href: "/", icon: <FiCompass />, label: "Dashboard", desc: "Back to your overview" },
  { href: "/find-resume", icon: <FiSearch />, label: "Find Resume", desc: "Search the talent pool" },
  { href: "/upload", icon: <FiUploadCloud />, label: "Upload New", desc: "Add a candidate resume" },
  { href: "/talent-pool", icon: <FiUsers />, label: "Talent Pool", desc: "Browse all candidates" },
];

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80dvh] px-4 py-12 animate-in fade-in duration-500">
      <div className="card-glass p-8 sm:p-12 max-w-xl w-full flex flex-col items-center text-center gap-6 shadow-soft">
        <div className="relative">
          <span className="text-7xl sm:text-8xl font-black bg-gradient-to-br from-[#00845a] to-emerald-400 dark:from-[#00b37a] dark:to-emerald-300 bg-clip-text text-transparent tracking-tighter">
            404
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            This page went missing
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-gray-400 max-w-sm">
            The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-[#00845a] hover:bg-[#006e4a] dark:bg-[#00b37a] dark:hover:bg-[#009c6a] text-white px-6 py-3 rounded-2xl shadow-lg shadow-[#00845a]/20 transition-all font-black text-xs uppercase tracking-[0.2em] active:scale-95"
          >
            <BackArrowIcon /> Return to Dashboard
          </Link>
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-gray-300 px-6 py-3 rounded-2xl transition-all font-black text-xs uppercase tracking-[0.2em] active:scale-95"
          >
            <FiArrowLeft /> Go Back
          </button>
        </div>

        <div className="w-full h-px bg-slate-100 dark:bg-white/5 my-1"></div>

        <div className="w-full grid grid-cols-2 gap-3">
          {SHORTCUTS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="flex flex-col items-start gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 hover:border-[#00845a]/30 dark:hover:border-[#00b37a]/30 hover:bg-white dark:hover:bg-white/[0.06] transition-all group text-left"
            >
              <span className="w-8 h-8 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-[#00845a] dark:text-[#00b37a] group-hover:scale-110 transition-transform">
                {s.icon}
              </span>
              <span>
                <span className="block text-xs font-black text-slate-800 dark:text-white">{s.label}</span>
                <span className="block text-[10px] font-medium text-slate-400 dark:text-gray-500">{s.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
