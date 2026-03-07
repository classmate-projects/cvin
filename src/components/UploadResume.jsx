"use client";

import { useRef, useState } from "react";
import { CloudUploadIcon, FileAddIcon, FileCancelIcon } from "@/lib/icons";
import { toast } from "react-toastify";
import ReviewMetadata from "./ReviewMetadata";
import { FiFile, FiLoader, FiZap } from "react-icons/fi";

export default function UploadResume({ aiOnline = true }) {
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [metadata, setMetadata] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const handleFile = async (files) => {
        if (!files || files.length === 0) return;
        const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        const selected = files[0];
        if (!allowed.includes(selected.type)) {
            toast.warn("Only PDF and DOCX files are allowed");
            return;
        }
        setFile(selected);
        handleAnalyze(selected);
    };

    const handleAnalyze = async (selectedFile) => {
        if (!aiOnline) {
            toast.info("AI Infrastructure Offline - Opening manual form");
            setMetadata({ name: "", email: "", job_title: "", location: "", experience_years: "", visa_status: "", specialization: "" });
            return;
        }

        setAnalyzing(true);
        const formData = new FormData();
        formData.append("file", selectedFile);
        try {
            const res = await fetch("/api/analyze", { method: "POST", body: formData });
            const data = await res.json();
            if (data.success) {
                toast.success("AI extraction complete!");
                setMetadata(data.metadata);
            } else {
                const isQuotaError = res.status === 429;
                toast.info(isQuotaError ? "AI busy - manual entry enabled." : "Analysis paused - manual entry enabled.");
                setMetadata({ name: "", email: "", job_title: "", location: "", experience_years: "", visa_status: "", specialization: "" });
            }
        } catch (error) {
            toast.warn("Switching to manual entry.");
            setMetadata({ name: "" });
        } finally {
            setAnalyzing(false);
        }
    };

    const handleFinalSubmit = async (verifiedData) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("resume_file", file);
        Object.keys(verifiedData).forEach(key => {
            if (verifiedData[key]) formData.append(key, verifiedData[key]);
        });
        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.success) {
                toast.success("Profile indexed!");
                resetUpload();
            } else {
                toast.error(data.message || "Upload failed");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetUpload = () => { setFile(null); setMetadata(null); setAnalyzing(false); };
    const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === "dragenter" || e.type === "dragover"); };
    const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files?.length > 0) handleFile(e.dataTransfer.files); };
    const triggerFileInput = () => fileInputRef.current.click();

    return (
        <div className="w-full">
            {metadata && <ReviewMetadata metadata={metadata} onConfirm={handleFinalSubmit} onCancel={resetUpload} isSubmitting={isSubmitting} />}

            <div
                className={`group relative flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] p-8 md:p-16 transition-all duration-500 cursor-pointer overflow-hidden ${dragActive
                    ? "bg-[#00845a]/5 dark:bg-[#00b37a]/10 border-[#00845a] dark:border-[#00b37a] scale-[1.01] shadow-2xl shadow-[#00845a]/10"
                    : "bg-slate-50/50 dark:bg-[#111111]/50 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-[#1a1a1a]"
                    } ${analyzing ? "pointer-events-none opacity-80" : ""}`}
                onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                onClick={!file ? triggerFileInput : undefined}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.01] pointer-events-none transition-opacity">
                    <div className="grid grid-cols-12 gap-4 h-full w-full rotate-12 scale-150">
                        {Array.from({ length: 48 }).map((_, i) => <FiFile key={i} className="text-4xl text-black dark:text-white" />)}
                    </div>
                </div>

                {analyzing ? (
                    <div className="flex flex-col items-center gap-8 relative z-10 animate-in zoom-in duration-300">
                        <div className="relative">
                            <FiLoader className="text-7xl text-[#00845a] dark:text-[#00b37a] animate-spin transition-colors" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="w-2 h-2 bg-[#00845a] dark:bg-[#00b37a] rounded-full animate-ping"></span>
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tighter uppercase italic transition-colors">Neural Processing...</h3>
                            <p className="text-xs font-bold text-slate-400 dark:text-gray-500 mt-2 uppercase tracking-widest flex items-center gap-2 justify-center transition-colors">
                                <FiZap className="text-[#00845a] dark:text-[#00b37a]" /> Decoding Candidate Identity
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-8 relative z-10 text-center">
                        <div className={`p-8 rounded-[2rem] transition-all duration-500 ${dragActive ? "bg-[#00845a] dark:bg-[#00b37a] text-white scale-110 rotate-12 shadow-xl shadow-[#00845a]/30" : "bg-white dark:bg-[#1a1a1a] text-slate-300 dark:text-gray-600 shadow-sm border border-slate-100 dark:border-white/5 group-hover:bg-[#00845a]/5 dark:group-hover:bg-[#00b37a]/10 group-hover:text-[#00845a] dark:group-hover:text-[#00b37a]"}`}>
                            <CloudUploadIcon className="text-6xl" />
                        </div>

                        <div className="space-y-3 px-4">
                            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors">
                                {file ? `Ready: ${file.name}` : (aiOnline ? "Portal Ingestion Zone" : "Manual Ingestion Zone")}
                            </h3>
                            <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed transition-colors">
                                {file ? (aiOnline ? "Verifying file structure for AI sync..." : "Extracting file details...") : (aiOnline ? "Drag and drop your identity document here or browse local storage." : "AI disconnected. Drag a file here to ingest via manual entry.")}
                            </p>
                        </div>

                        {!file && (
                            <button className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-gray-400 hover:border-[#00845a] dark:hover:border-[#00b37a] hover:text-[#00845a] dark:hover:text-[#00b37a] transition-all shadow-sm active:scale-95">
                                Select File
                            </button>
                        )}

                        {file && (
                            <div className="flex flex-col items-center gap-3">
                                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-[#00b37a]/10 text-[#00845a] dark:text-[#00b37a] rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-[#00b37a]/20 transition-colors">
                                    <span className="w-1.5 h-1.5 bg-[#00845a] dark:bg-[#00b37a] rounded-full animate-pulse transition-colors"></span>
                                    Integrity Check Passed
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); resetUpload(); }} className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                                    Cancel and Retry
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <input type="file" accept=".pdf,.docx" ref={fileInputRef} className="hidden" onChange={(e) => handleFile(e.target.files)} />
            </div>
        </div>
    );
}
