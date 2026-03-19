"use client";

import { useEffect, useState } from "react";
import { BackArrowIcon } from "@/lib/icons";
import { FiCheckCircle, FiUser, FiMail, FiMapPin, FiBriefcase, FiAperture, FiShield } from "react-icons/fi";

export default function ReviewMetadata({ metadata, onConfirm, onCancel, isSubmitting }) {
    const [formData, setFormData] = useState(metadata);
    const [config, setConfig] = useState(null);
    const [specPlaceholder, setSpecPlaceholder] = useState("e.g. React, Node.js, Project Management");

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch("/api/config");
                const data = await res.json();
                if (data.success) {
                    setConfig(data.config);
                    if (metadata.job_title) {
                        const match = data.config.job_title?.find(j => j.value === metadata.job_title);
                        if (match?.placeholder) setSpecPlaceholder(match.placeholder);
                    }
                }
            } catch (error) {
                console.error("Failed to load config", error);
            }
        };
        fetchConfig();
    }, [metadata.job_title]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === "job_title" && config?.job_title) {
            const selectedJob = config.job_title.find(j => j.value === value);
            setSpecPlaceholder(selectedJob?.placeholder || "e.g. Key skills, tools, technologies");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 z-[100] backdrop-blur-sm p-4 overflow-y-auto selection:bg-[#00845a]/10 selection:text-[#00845a] transition-colors">
            <div className="bg-white dark:bg-[#111111] rounded-[2rem] md:rounded-[2.5rem] w-full max-w-3xl p-6 md:p-10 shadow-2xl my-auto animate-in zoom-in-95 fade-in duration-300 relative overflow-hidden border border-white dark:border-white/5 transition-colors  mt-20">

                <div className="relative z-10 space-y-2 mb-8 md:mb-10"> 
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white/60 tracking-tighter transition-colors">Add Identity Profile</h2>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); onConfirm(formData); }} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                        {/* Name Input Box */}
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[10px] text-slate-400 dark:text-gray-500 uppercase font-black tracking-widest px-1 transition-colors">Candidate Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-300 dark:text-gray-600 group-focus-within:text-[#00845a] dark:group-focus-within:text-[#00b37a] transition-colors">
                                    <FiUser />
                                </div>
                                <input
                                    name="candidate_name"
                                    value={formData.candidate_name || ""}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-700 dark:text-gray-200 outline-none ring-2 ring-transparent focus:ring-[#00845a]/20 dark:focus:ring-[#00b37a]/20 transition-all font-black placeholder:text-slate-300 dark:placeholder:text-gray-600 shadow-inner"
                                    required
                                    placeholder="Enter full name"
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 dark:text-gray-500 uppercase font-black tracking-widest px-1 transition-colors">Primary Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-300 dark:text-gray-600 group-focus-within:text-[#00845a] dark:group-focus-within:text-[#00b37a] transition-colors">
                                    <FiMail />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email || ""}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-2xl pl-12 pr-4 py-3 text-xs text-slate-600 dark:text-gray-300 outline-none ring-2 ring-transparent focus:ring-[#00845a]/20 dark:focus:ring-[#00b37a]/20 transition-all placeholder:text-slate-300 dark:placeholder:text-gray-600 shadow-inner"
                                    placeholder="candidate@work.com"
                                />
                            </div>
                        </div>

                        {/* Location Input */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 dark:text-gray-500 uppercase font-black tracking-widest px-1 transition-colors">Base Location</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-300 dark:text-gray-600 group-focus-within:text-[#00845a] dark:group-focus-within:text-[#00b37a] transition-colors">
                                    <FiMapPin />
                                </div>
                                <input
                                    name="location"
                                    value={formData.location || ""}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-2xl pl-12 pr-4 py-3 text-xs text-slate-600 dark:text-gray-300 outline-none ring-2 ring-transparent focus:ring-[#00845a]/20 dark:focus:ring-[#00b37a]/20 transition-all placeholder:text-slate-300 dark:placeholder:text-gray-600 shadow-inner"
                                    placeholder="e.g. Dubai, UAE"
                                />
                            </div>
                        </div>

                        {/* Job Title Dropdown */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 dark:text-gray-500 uppercase font-black tracking-widest px-1 transition-colors">Target Department</label>
                            <select
                                name="job_title"
                                value={formData.job_title || ""}
                                onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-2xl px-5 py-3 text-xs text-slate-600 dark:text-gray-300 outline-none ring-2 ring-transparent focus:ring-[#00845a]/20 dark:focus:ring-[#00b37a]/20 transition-all appearance-none cursor-pointer shadow-inner font-bold"
                            >
                                <option value="">Select Domain</option>
                                {config?.job_title?.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Experience Input */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 dark:text-gray-500 uppercase font-black tracking-widest px-1 transition-colors">Verified Experience (Yrs)</label>
                            <input
                                name="experience_years"
                                type="number"
                                value={formData.experience_years || ""}
                                onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-2xl px-5 py-3 text-xs text-slate-600 dark:text-gray-300 outline-none ring-2 ring-transparent focus:ring-[#00845a]/20 dark:focus:ring-[#00b37a]/20 transition-all shadow-inner font-black"
                                placeholder="0"
                            />
                        </div>

                        {/* Visa Status Input with Suggestions */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 dark:text-gray-500 uppercase font-black tracking-widest px-1 transition-colors">Visa Status</label>
                            <input
                                name="visa_status"
                                list="visa-status-list"
                                value={formData.visa_status || ""}
                                onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-2xl px-5 py-3 text-xs text-slate-600 dark:text-gray-300 outline-none ring-2 ring-transparent focus:ring-[#00845a]/20 dark:focus:ring-[#00b37a]/20 transition-all shadow-inner font-bold"
                                placeholder="e.g. Employment Visa, Golden Visa"
                            />
                            <datalist id="visa-status-list">
                                {config?.visa_status?.map(opt => (
                                    <option key={opt.value} value={opt.value} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    {/* Education Field with Suggestions */}
                    <div className="space-y-1.5 pt-2">
                        <label className="text-[10px] text-slate-400 dark:text-gray-500 uppercase font-black tracking-widest px-1 transition-colors">Education Details</label>
                        <textarea
                            name="education"
                            list="education-list"
                            value={formData.education || ""}
                            onChange={handleChange}
                            rows="2"
                            className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-2xl px-5 py-3 text-xs text-slate-700 dark:text-gray-200 outline-none ring-2 ring-transparent focus:ring-[#00845a]/20 dark:focus:ring-[#00b37a]/20 transition-all shadow-inner font-medium placeholder:italic dark:placeholder:text-gray-600"
                            placeholder="e.g. Bachelor of Science in Computer Science"
                        />
                        <datalist id="education-list">
                            {config?.education?.map(opt => (
                                <option key={opt.value} value={opt.value} />
                            ))}
                        </datalist>
                    </div>

                    {/* Specialization Field with Suggestions */}
                    <div className="space-y-1.5 pt-2">
                        <label className="text-[10px] text-slate-400 dark:text-gray-500 uppercase font-black tracking-widest px-1 flex items-center gap-2 transition-colors">
                            Neural Keyword Tagging <FiAperture className="text-[#00845a] dark:text-[#00b37a]" />
                        </label>
                        <input
                            name="specialization"
                            list="specialization-list"
                            value={formData.specialization || ""}
                            onChange={handleChange}
                            className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-l-4 border-l-[#00845a] dark:border-l-[#00b37a] rounded-2xl px-5 py-3.5 text-xs text-slate-700 dark:text-gray-200 outline-none ring-2 ring-transparent focus:ring-[#00845a]/20 dark:focus:ring-[#00b37a]/20 transition-all shadow-inner font-bold placeholder:italic placeholder:font-medium dark:placeholder:text-gray-600"
                            placeholder={specPlaceholder}
                        />
                        <datalist id="specialization-list">
                            {config?.specialization?.map(opt => (
                                <option key={opt.value} value={opt.value} />
                            ))}
                        </datalist>
                    </div>

                    {/* CTA Primary and Secondary Buttons */}
                    <div className="flex flex-col md:flex-row gap-4 pt-6 md:pt-8 w-full">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] bg-[#00845a] dark:bg-[#00b37a]/10 dark:text-[#00b37a] dark:border dark:border-[#00b37a]/50 hover:bg-[#006e4a] dark:hover:bg-[#00b37a]/30 text-white font-black text-xs uppercase tracking-[0.2em] py-4 rounded-2xl transition-all disabled:opacity-50 shadow-xl shadow-[#00845a]/20 dark:shadow-[#00b37a]/10 active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? "Syncing..." : <>Confirm Profile</>}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="flex-1 bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-400 dark:text-gray-500 font-black text-xs uppercase tracking-widest py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                        >
                            <BackArrowIcon /> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
