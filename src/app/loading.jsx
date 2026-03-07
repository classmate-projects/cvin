"use client";

import { FiLoader } from "react-icons/fi";

export default function Loading() {
    return (
        <div className="w-full h-[80vh] flex flex-col items-center justify-center animate-in fade-in duration-700">
            <div className="relative">
                <FiLoader className="text-6xl text-[#00845a] dark:text-[#00b37a] animate-spin transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="w-2 h-2 bg-[#00845a] dark:bg-[#00b37a] rounded-full animate-ping"></span>
                </div>
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tighter uppercase mt-6 tracking-[0.2em] transition-colors">
                Retrieving Workspace...
            </h3>
            <p className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mt-2 transition-colors">
                Initializing Intelligence Engine
            </p>
        </div>
    );
}
