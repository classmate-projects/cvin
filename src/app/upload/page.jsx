"use client";

import { useState, useEffect } from "react";
import UploadResume from "@/components/UploadResume";
import Link from "next/link";
import { BackArrowIcon, FileAddIcon } from "@/lib/icons";
import { FiCpu, FiShield, FiUploadCloud } from "react-icons/fi";

export default function UploadPage() {
    const [aiStatus, setAiStatus] = useState({ checked: false, online: true });

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
        <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
            {/* Page Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="p-3.5 bg-white dark:bg-[#111111] hover:bg-[#00845a]/5 dark:hover:bg-[#00845a]/20 text-slate-400 dark:text-gray-500 hover:text-[#00845a] dark:hover:text-[#00b37a] rounded-2xl border border-slate-200 dark:border-white/5 transition-all shadow-sm active:scale-90"
                    >
                        <BackArrowIcon className="text-xl" />
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Expand Talent Pool</h1>
                        <p className="text-sm text-slate-500 dark:text-gray-400 font-medium italic transition-colors">Powered by Gemini Visual AI Architecture</p>
                    </div>
                </div>
                <div className={`hidden lg:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest bg-white dark:bg-[#1a1a1a] px-6 py-4 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm border-l-4 transition-colors ${aiStatus.online ? 'text-[#00845a] dark:text-[#00b37a] border-l-[#00845a] dark:border-l-[#00b37a]' : 'text-rose-500 border-l-rose-500'}`}>
                    <div className="relative">
                        {aiStatus.online ? (
                            <>
                                <div className="w-2 h-2 bg-[#00845a] dark:bg-[#00b37a] rounded-full animate-ping absolute inset-0"></div>
                                <div className="w-2 h-2 bg-[#00845a] dark:bg-[#00b37a] rounded-full relative z-10"></div>
                            </>
                        ) : (
                            <div className="w-2 h-2 bg-rose-500 rounded-full relative z-10"></div>
                        )}
                    </div>
                    {aiStatus.checked ? (aiStatus.online ? "AI Infrastructure Online" : "AI Infrastructure Offline") : "Checking AI Status..."}
                </div>
            </header>

            {/* Central Upload Component Unit */}
            <div className="card-glass p-8 sm:p-16 bg-white dark:bg-[#151515] space-y-12 relative overflow-hidden transition-colors">
                {/* Modern Decorative Element */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.02] group-hover:opacity-[0.08] dark:group-hover:opacity-[0.05] transition-opacity">
                    <FiUploadCloud className="text-[200px] text-[#00845a] dark:text-white" />
                </div>

                <div className="text-center relative z-10 transition-colors">
                    <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-[#00845a]/5 dark:bg-[#00b37a]/10 text-[#00845a] dark:text-[#00b37a] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-[#00845a]/10 dark:border-[#00b37a]/20 hover:bg-[#00845a]/10 dark:hover:bg-[#00b37a]/20 transition-colors cursor-default">
                        <FiShield /> End-to-End Encryption
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter transition-colors">Import Talent Profiles</h2>
                    <p className="text-sm text-slate-500 dark:text-gray-400 font-medium max-w-lg mx-auto leading-relaxed transition-colors">
                        Supporting native <span className="text-slate-900 dark:text-white font-black">PDF</span> and <span className="text-slate-900 dark:text-white font-black">DOCX</span> formats.
                        Our intelligent sync engine will extract candidate identity automatically.
                    </p>
                </div>

                <div className="relative z-20">
                    <UploadResume aiOnline={aiStatus.online} />
                </div>
            </div>

            {/* Step Guides / USP Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <USPItem
                    icon={<FiUploadCloud />}
                    title="Ingestion"
                    desc="Drop resume files directly into the neural cloud zone."
                    color="text-blue-500 dark:text-blue-400"
                />
                <USPItem
                    icon={<FiCpu />}
                    title="Verification"
                    desc="Refine AI-extracted data points before committing to store."
                    color="text-emerald-500 dark:text-emerald-400"
                />
                <USPItem
                    icon={<FiShield />}
                    title="Indexing"
                    desc="Securely indexed and ready for global talent search."
                    color="text-indigo-500 dark:text-indigo-400"
                />
            </div>
        </div>
    );
}

function USPItem({ icon, title, desc, color }) {
    return (
        <div className="card-glass p-8 bg-white/60 dark:bg-[#1a1a1a]/60 hover:bg-white dark:hover:bg-[#1a1a1a] transition-all border-slate-100/50 dark:border-white/5">
            <div className={`text-2xl mb-4 transition-colors ${color}`}>{icon}</div>
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest mb-2 px-1 border-l-2 border-slate-200 dark:border-white/20 transition-colors">{title}</h4>
            <p className="text-xs text-slate-400 dark:text-gray-500 font-medium leading-relaxed transition-colors">{desc}</p>
        </div>
    );
}
