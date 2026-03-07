"use client";

import { useEffect, useState } from "react";
import { FiUsers, FiStar, FiChevronRight, FiUser } from "react-icons/fi";
import Link from "next/link";
import { toast } from "react-toastify";

export default function TalentPoolPage() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopTalent = async () => {
            try {
                const res = await fetch("/api/talent-pool");
                const data = await res.json();
                if (data.success) {
                    setGroups(data.groups);
                } else {
                    toast.error("Failed to load talent pool.");
                }
            } catch (err) {
                toast.error("Network error while trying to reach API.");
            } finally {
                setLoading(false);
            }
        };

        fetchTopTalent();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center animate-in fade-in duration-500">
                <FiUsers className="text-4xl text-[#00845a] dark:text-[#00b37a] animate-bounce mb-4" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aggregating Talent Pool...</span>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
                        Top Talent Pool
                    </h1>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-gray-400 font-medium transition-colors">
                        Reviewing top 10 ranked candidates across each job designation
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 px-4 py-2.5 rounded-xl shadow-sm">
                    <FiStar className="text-yellow-500" />
                    <span className="text-xs font-bold text-slate-600 dark:text-gray-300">Premium Insight Active</span>
                </div>
            </header>

            {/* Designations Grid */}
            <div className="space-y-12">
                {groups.length === 0 ? (
                    <div className="text-center p-12 card-glass text-slate-400 uppercase text-xs font-bold tracking-widest">
                        No candidates found in the system yet.
                    </div>
                ) : (
                    groups.map((group) => (
                        <div key={group.designation} className="space-y-4">
                            <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-white/10 pb-4">
                                <h2 className="text-lg font-black text-slate-800 dark:text-[#00b37a] uppercase tracking-widest flex items-center gap-3">
                                    {group.designation}
                                    <span className="bg-[#00845a] text-white text-[10px] px-2 py-0.5 rounded-full">Top {group.candidates.length}</span>
                                </h2>
                                <Link href={`/find-resume?job_title=${encodeURIComponent(group.designation)}`} className="text-xs font-bold text-slate-400 hover:text-[#00845a] flex items-center gap-1 transition-colors">
                                    View All <FiChevronRight />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {group.candidates.map((candidate, idx) => (
                                    <div key={candidate.resume_id} className="card-glass p-6 group hover:-translate-y-1 hover:shadow-xl transition-all border border-slate-100 dark:border-white/5 bg-white dark:bg-[#151515]">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-[#00845a]/10 group-hover:text-[#00845a] transition-colors relative">
                                                    {candidate.candidate_name.charAt(0)}
                                                    {idx < 3 && (
                                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-black rounded-full flex items-center justify-center text-[8px] font-black shadow-sm">
                                                            {idx + 1}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-slate-800 dark:text-white capitalize group-hover:text-[#00845a] dark:group-hover:text-[#00b37a] transition-colors line-clamp-1">{candidate.candidate_name}</h3>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1">
                                                        <FiStar className="text-yellow-500" /> {candidate.experience_years} Yrs Exp
                                                    </p>
                                                </div>
                                            </div>
                                            <a
                                                href={`/api/resumes/${candidate.resume_id}/preview`}
                                                target="_blank" rel="noreferrer"
                                                className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#00845a] hover:text-white hover:border-transparent transition-colors"
                                            >
                                                <FiUser />
                                            </a>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="text-xs text-slate-600 dark:text-gray-300 flex items-center gap-2 font-medium">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-white/10"></span>
                                                <span className="truncate">{candidate.specialization || "Generalist"}</span>
                                            </div>
                                            <div className="text-xs text-slate-600 dark:text-gray-300 flex items-center gap-2 font-medium">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-white/10"></span>
                                                <span className="truncate">{candidate.location || "Remote Allowed"}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
