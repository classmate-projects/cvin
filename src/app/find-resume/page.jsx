"use client";

import { useEffect, useState, useCallback } from "react";
import {
    SearchIcon,
    FilePdfIcon,
    FileDocxIcon,
    EyeIcon,
    DeleteIcon,
    EmptyIcon,
    ToLeftArrowIcon,
    ToRightArrowIcon,
} from "@/lib/icons";
import { FiFilter, FiRefreshCw, FiGrid, FiLayers } from "react-icons/fi";

export default function FindResume() {
    const [resumes, setResumes] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState("created_at");
    const [search, setSearch] = useState("");
    const [config, setConfig] = useState(null);

    // Advanced Filters
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [jobTitle, setJobTitle] = useState("");
    const [visaStatus, setVisaStatus] = useState("");
    const [experienceMin, setExperienceMin] = useState("");
    const [experienceMax, setExperienceMax] = useState("");
    const [location, setLocation] = useState("");

    const fetchConfig = async () => {
        try {
            const res = await fetch("/api/config");
            const data = await res.json();
            if (data.success) setConfig(data.config);
        } catch (error) {
            console.error("Config fetch error:", error);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchResumes = useCallback(
        async (pageNum) => {
            try {
                setLoading(true);
                const params = new URLSearchParams({
                    page: pageNum,
                    limit: 10,
                    sort: sortBy,
                    search: search,
                    job_title: jobTitle,
                    visa_status: visaStatus,
                    experience_min: experienceMin,
                    experience_max: experienceMax,
                    location: location,
                });

                const res = await fetch(`/api/resumes?${params.toString()}`);
                const data = await res.json();

                if (data.success) {
                    setResumes(data.resumes);
                    setHasMore(data.hasMore);
                }
            } catch (err) {
                console.error("Error fetching resumes:", err);
            } finally {
                setLoading(false);
            }
        },
        [sortBy, search, jobTitle, visaStatus, experienceMin, experienceMax, location]
    );

    useEffect(() => {
        setPage(1);
    }, [search, jobTitle, visaStatus, experienceMin, experienceMax, location, sortBy]);

    useEffect(() => {
        fetchResumes(page);
    }, [page, fetchResumes]);

    const resetFilters = () => {
        setJobTitle("");
        setVisaStatus("");
        setExperienceMin("");
        setExperienceMax("");
        setLocation("");
        setSearch("");
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Talent Discovery</h1>
                    <p className="text-sm text-slate-500 dark:text-gray-400 font-medium transition-colors">Search through {resumes.length}+ scanned talent profiles</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={resetFilters}
                        className="text-xs font-bold text-slate-400 dark:text-gray-400 hover:text-[#00845a] dark:hover:text-[#00b37a] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 transition-all flex items-center gap-2 bg-white dark:bg-[#1a1a1a]"
                    >
                        <FiRefreshCw /> Reset Filters
                    </button>
                    <button className="p-2.5 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl text-slate-400 dark:text-gray-400 hover:text-[#00845a] dark:hover:text-[#00b37a] transition-all hidden sm:block">
                        <FiGrid />
                    </button>
                </div>
            </header>

            {/* Premium Filter Box */}
            <div className="card-glass p-8 bg-white dark:bg-[#151515] space-y-8 transition-colors">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Search Bar */}
                    <div className="flex-1 relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none group-focus-within:text-[#00845a] dark:group-focus-within:text-[#00b37a]">
                            <SearchIcon className="text-slate-400 dark:text-gray-500 text-lg transition-colors" />
                        </div>
                        <input
                            type="search"
                            placeholder="Search by name, skills, title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-700 dark:text-gray-200 outline-none ring-2 ring-transparent focus:ring-[#00845a]/20 dark:focus:ring-[#00b37a]/20 focus:bg-white dark:focus:bg-[#151515] transition-all shadow-inner dark:shadow-black/20"
                        />
                    </div>

                    {/* Quick Selectors */}
                    <div className="flex items-center gap-4">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 text-xs font-bold px-6 py-3.5 rounded-2xl outline-none focus:border-[#00845a] dark:focus:border-[#00b37a] transition-all cursor-pointer shadow-sm min-w-[180px]"
                        >
                            <option value="created_at">Date Added</option>
                            <option value="candidate_name">Full Name</option>
                            <option value="experience_years">Experience Level</option>
                        </select>

                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className={`px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border outline-none group flex items-center gap-2 ${showAdvanced
                                ? "bg-emerald-50 dark:bg-emerald-500/10 border-[#00845a] dark:border-[#00b37a] text-[#00845a] dark:text-[#00b37a]"
                                : "bg-white dark:bg-[#1a1a1a] border-slate-200 dark:border-white/10 text-slate-400 dark:text-gray-400 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-600 dark:hover:text-gray-200 shadow-sm"
                                }`}
                        >
                            <FiFilter className={`${showAdvanced ? "animate-pulse" : "group-hover:rotate-12"} transition-transform`} />
                            {showAdvanced ? "Hide Filters" : "Advanced View"}
                        </button>
                    </div>
                </div>

                {/* Collapsible Advanced Filters */}
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-300 ease-in-out ${showAdvanced ? "opacity-100 max-h-[400px]" : "opacity-0 max-h-0 pointer-events-none overflow-hidden"}`}>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">Expected Job Title</label>
                        <select
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-xl px-4 py-2.5 text-xs text-slate-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#00845a]/20 dark:focus:ring-[#00b37a]/20 transition-colors"
                        >
                            <option value="">All Job Titles</option>
                            {config?.job_title?.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">Visa Authorization</label>
                        <select
                            value={visaStatus}
                            onChange={(e) => setVisaStatus(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-xl px-4 py-2.5 text-xs text-slate-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#00845a]/20 dark:focus:ring-[#00b37a]/20 transition-colors"
                        >
                            <option value="">All Statuses</option>
                            {config?.visa_status?.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">Experience Range (Yrs)</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                value={experienceMin}
                                onChange={(e) => setExperienceMin(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-xl px-4 py-2.5 text-xs text-slate-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#00845a]/20 dark:focus:ring-[#00b37a]/20 transition-colors"
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={experienceMax}
                                onChange={(e) => setExperienceMax(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-xl px-4 py-2.5 text-xs text-slate-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#00845a]/20 dark:focus:ring-[#00b37a]/20 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">Target Location</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-300 dark:text-gray-600 transition-colors">
                                <FiLayers className="text-xs" />
                            </div>
                            <input
                                placeholder="e.g. Dubai, London"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#00845a]/20 dark:focus:ring-[#00b37a]/20 transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Data Grid */}
            <div className="card-glass overflow-hidden bg-white dark:bg-[#151515] transition-colors p-0">
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-[#1a1a1a] text-slate-400 dark:text-gray-500 font-black uppercase tracking-[0.15em] text-[10px] border-b border-slate-100 dark:border-white/5 transition-colors">
                            <th className="py-5 px-8 text-left">Talent Workspace</th>
                            <th className="py-5 px-8 text-left">Department / Skills</th>
                            <th className="py-5 px-8 text-center">Source</th>
                            <th className="py-5 px-8 text-right">Integrations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/60 dark:divide-white/5 transition-colors">
                        {resumes.length > 0 ? (
                            resumes.map((resume) => (
                                <tr key={resume.resume_id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[#00845a]/5 dark:bg-[#00b37a]/10 text-[#00845a] dark:text-[#00b37a] flex items-center justify-center font-black text-sm group-hover:scale-110 transition-all shadow-sm border border-[#00845a]/10 dark:border-[#00b37a]/20 uppercase">
                                                {resume.candidate_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-800 dark:text-white text-base uppercase tracking-tight group-hover:text-[#00845a] dark:group-hover:text-[#00b37a] transition-colors">{resume.candidate_name}</div>
                                                <div className="text-[10px] text-slate-400 dark:text-gray-500 font-bold flex items-center gap-2 mt-0.5 transition-colors">
                                                    <span>{resume.email}</span>
                                                    <span className="w-1 h-1 bg-slate-200 dark:bg-gray-700 rounded-full transition-colors"></span>
                                                    <span>Added {new Date(resume.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="text-slate-700 dark:text-gray-200 font-black text-xs uppercase tracking-tight transition-colors">{resume.job_title || "Uncategorized"}</div>
                                        <div className="text-[10px] text-slate-400 dark:text-gray-500 font-medium italic mt-1 line-clamp-1 transition-colors">{resume.location || "Global Remote"}</div>
                                    </td>
                                    <td className="py-6 px-8 text-center">
                                        {resume.file_type?.toLowerCase().includes("pdf") ? (
                                            <span className="inline-flex items-center gap-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black px-2.5 py-1 rounded-lg border border-rose-100 dark:border-rose-500/20 shadow-sm transition-colors">
                                                <FilePdfIcon /> PDF
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-500/20 shadow-sm transition-colors">
                                                <FileDocxIcon /> DOCX
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => window.open(`/api/resumes/${resume.resume_id}/preview`, "_blank")}
                                                className="p-3 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 text-slate-400 dark:text-gray-400 hover:text-[#00845a] dark:hover:text-[#00b37a] hover:border-[#00845a] dark:hover:border-[#00b37a] hover:bg-emerald-50 dark:hover:bg-[#00845a]/10 rounded-2xl transition-all shadow-sm"
                                            >
                                                <EyeIcon className="text-xl" />
                                            </button>
                                            <button className="p-3 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 text-slate-400 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all shadow-sm">
                                                <DeleteIcon className="text-xl" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-32 text-center bg-slate-50/20 dark:bg-transparent">
                                    <div className="flex flex-col items-center gap-8 text-slate-300 dark:text-gray-600">
                                        <div className="relative">
                                            <EmptyIcon className="text-[100px] opacity-10" />
                                            <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                                                <SearchIcon className="text-4xl opacity-20" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xl font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest transition-colors">No Matches Found</p>
                                            <p className="text-xs font-bold opacity-60">Adjust your criteria or try a different keyword</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Localized Pagination Interaction */}
                <div className="p-6 bg-slate-50/40 dark:bg-transparent flex justify-between items-center border-t border-slate-100 dark:border-white/5 transition-colors">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="px-6 py-3 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-20 hover:border-slate-300 dark:hover:border-white/20 shadow-sm transition-all flex items-center gap-3"
                    >
                        <ToLeftArrowIcon /> Previous
                    </button>
                    <div className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#1a1a1a] border border-slate-100 dark:border-white/10 rounded-2xl shadow-inner transition-colors">
                        <span className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest mr-2 transition-colors">Results Page</span>
                        <div className="w-7 h-7 flex items-center justify-center bg-[#00845a] text-white text-[11px] font-black rounded-lg shadow-sm">
                            {page}
                        </div>
                    </div>
                    <button
                        disabled={!hasMore}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-6 py-3 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-20 hover:border-slate-300 dark:hover:border-white/20 shadow-sm transition-all flex items-center gap-3"
                    >
                        Next <ToRightArrowIcon />
                    </button>
                </div>
            </div>

            {loading && <div className="fixed bottom-10 right-10 bg-white dark:bg-[#111111] border border-[#00845a]/20 dark:border-[#00b37a]/30 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 text-[10px] font-black text-[#00845a] dark:text-[#00b37a] uppercase tracking-widest animate-in slide-in-from-bottom-5 transition-colors z-50">
                <div className="w-2 h-2 bg-[#00845a] dark:bg-[#00b37a] rounded-full animate-ping"></div>
                Optimizing Talent Index...
            </div>}
        </div>
    );
}
