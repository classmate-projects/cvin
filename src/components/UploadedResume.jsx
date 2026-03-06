"use client";

import { DeleteIcon, EmptyIcon, EyeIcon, FileDocxIcon, FilePdfIcon, ToLeftArrowIcon, ToRightArrowIcon } from "@/lib/icons";
import { useEffect, useState } from "react";
import ConfirmDelete from "./ConfirmDelete";
import { toast } from "react-toastify";

export default function UploadedResume() {
    const [resumes, setResumes] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchResumes = async (pageNum = 1) => {
        try {
            const res = await fetch(`/api/resumes?page=${pageNum}&limit=5`);
            const data = await res.json();

            if (data.success) {
                setResumes(data.resumes);
                setHasMore(data.hasMore);
            }
        } catch (err) {
            console.error("Error:", err);
            setResumes([]);
        }
    };

    useEffect(() => {
        fetchResumes(page);
    }, [page]);

    const handlePreview = (id) => window.open(`/api/resumes/${id}/preview`, "_blank");

    return (
        <div className="w-full transition-colors duration-300">
            {deleteTarget && (
                <ConfirmDelete
                    candidateName={deleteTarget.name}
                    onConfirm={async () => {
                        try {
                            const res = await fetch(`/api/resumes/${deleteTarget.id}`, { method: "DELETE" });
                            if (res.ok) {
                                toast.success("Removed successfully");
                                fetchResumes(page);
                            }
                        } catch (err) {
                            toast.error("Deletion failed");
                        }
                        setDeleteTarget(null);
                    }}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            <div className="bg-transparent overflow-hidden">
                <table className="w-full text-sm text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-[#1a1a1a]/50 text-slate-400 dark:text-gray-500 font-black uppercase tracking-[0.15em] text-[9px] border-b border-slate-100 dark:border-white/5 transition-colors">
                            <th className="py-5 px-6">Candidate Details</th>
                            <th className="py-5 px-6">Specialization / Department</th>
                            <th className="py-5 px-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/60 dark:divide-white/5">
                        {resumes.length > 0 ? (
                            resumes.map((resume) => (
                                <tr key={resume.resume_id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="py-5 px-6 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center font-bold text-slate-400 dark:text-gray-500 text-xs transition-colors">
                                                {resume.candidate_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-800 dark:text-white capitalize text-sm transition-colors">{resume.candidate_name}</div>
                                                <div className="text-[10px] text-slate-400 dark:text-gray-500 font-bold uppercase mt-0.5 tracking-tight transition-colors">
                                                    {resume.file_type} • {new Date(resume.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 relative z-10">
                                        <div className="text-[#00845a] dark:text-[#00b37a] font-bold text-xs transition-colors">{resume.job_title || "Generalist"}</div>
                                        <div className="text-[10px] text-slate-400 dark:text-gray-500 font-medium mt-0.5 line-clamp-1 italic transition-colors">{resume.specialization || "Mixed Skills"}</div>
                                    </td>
                                    <td className="py-5 px-6 text-right relative z-10 transition-colors">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handlePreview(resume.resume_id)}
                                                className="p-2 text-slate-400 dark:text-gray-400 hover:text-[#00845a] dark:hover:text-[#00b37a] hover:bg-emerald-50 dark:hover:bg-[#00845a]/10 rounded-lg transition-all"
                                            >
                                                <EyeIcon className="text-lg" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget({ id: resume.resume_id, name: resume.candidate_name })}
                                                className="p-2 text-slate-400 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                                            >
                                                <DeleteIcon className="text-lg" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="py-24 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-20">
                                        <EmptyIcon className="text-6xl text-slate-400 dark:text-gray-400 transition-colors" />
                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 dark:text-gray-500 transition-colors">No Talent History Found</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Local Pagination */}
                {resumes.length > 0 && (
                    <div className="bg-slate-50/30 dark:bg-transparent p-4 flex justify-between items-center border-t border-slate-100 dark:border-white/5 transition-colors">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-4 py-2 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 disabled:opacity-30 flex items-center gap-2 transition-all hover:bg-slate-50 dark:hover:bg-[#252525]"
                        >
                            <ToLeftArrowIcon className="text-[8px]" /> Previous
                        </button>
                        <span className="text-[10px] font-black text-slate-400 dark:text-gray-500 transition-colors">Page {page}</span>
                        <button
                            disabled={!hasMore}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-4 py-2 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 disabled:opacity-30 flex items-center gap-2 transition-all hover:bg-slate-50 dark:hover:bg-[#252525]"
                        >
                            Next <ToRightArrowIcon className="text-[8px]" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
