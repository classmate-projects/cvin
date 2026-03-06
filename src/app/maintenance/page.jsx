"use client";

import Link from "next/link";
import { BackArrowIcon } from "@/lib/icons";
import { FiTool } from "react-icons/fi";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function MaintenanceContent() {
    const searchParams = useSearchParams();
    const serviceName = searchParams.get("service") || "This Module";

    return (
        <div className="flex flex-col items-center justify-center p-8 h-[70vh] animate-in zoom-in-95 duration-500 text-center">
            <div className="card-glass p-12 bg-white dark:bg-[#151515] border-slate-200 dark:border-white/5 max-w-lg w-full flex flex-col items-center gap-6 shadow-soft transition-colors duration-300">
                <div className="w-24 h-24 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mb-2 border border-rose-100 dark:border-rose-500/20 shadow-sm transition-colors duration-300">
                    <FiTool className="text-4xl animate-pulse" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter transition-colors duration-300">
                        Maintenance Mode
                    </h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-gray-400 transition-colors duration-300">
                        <span className="font-bold text-[#00845a] dark:text-[#00b37a]">{serviceName}</span> is currently undergoing structured upgrades to integrate with our new intelligence engine.
                    </p>
                </div>

                <div className="w-full h-px bg-slate-100 dark:bg-white/5 my-2 transition-colors duration-300"></div>

                <Link
                    href="/"
                    className="bg-[#00845a] hover:bg-[#006e4a] dark:bg-[#00b37a]/10 dark:text-[#00b37a] dark:hover:bg-[#00b37a]/30 dark:border dark:border-[#00b37a]/50 text-white px-8 py-3.5 rounded-2xl shadow-lg shadow-[#00845a]/20 dark:shadow-[#00b37a]/10 transition-all font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2"
                >
                    <BackArrowIcon /> Return to Dashboard
                </Link>
            </div>
        </div>
    );
}

export default function MaintenancePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MaintenanceContent />
        </Suspense>
    );
}
