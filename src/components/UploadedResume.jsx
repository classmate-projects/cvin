"use client";

import { DeleteIcon, EyeIcon, FileDocxIcon, FilePdfIcon, PrintIcon } from "@/lib/icons";
import { useEffect, useState } from "react";
import ConfirmDelete from "./ConfirmDelete";

export default function UploadedResume() {
    const [resumes, setResumes] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // { id, name } or null


    // Fetch resumes (latest 10 per page)
    const fetchResumes = async (pageNum = 1) => {
        try {
            const res = await fetch(`/api/resumes?page=${pageNum}`);
            const data = await res.json();

            setResumes(Array.isArray(data.resumes) ? data.resumes : []);
            setHasMore(Boolean(data.hasMore));
        } catch (err) {
            console.error("Error fetching resumes:", err);
            setResumes([]);
            setHasMore(false);
        }
    };

    useEffect(() => {
        fetchResumes(page);

        // Optional: polling every 5s
        const interval = setInterval(() => {
            fetchResumes(page);
        }, 5000);

        return () => clearInterval(interval);
    }, [page]);

    const handlePreview = (id) => window.open(`/api/resumes/${id}/preview`, "_blank");
    const handlePrint = (id) => window.open(`/api/resumes/${id}/print`, "_blank");
    const handleDelete = async (id) => {
        // if (confirm("Delete this resume?")) {
        //     try {
        //         await fetch(`/api/resumes/${id}`, { method: "DELETE" });
        //         fetchResumes(page);
        //     } catch (err) {
        //         console.error("Error deleting resume:", err);
        //     }
        // }

        <ConfirmDelete />
    };

    return (
        <>
            {deleteTarget && (
                <ConfirmDelete
                    candidateName={deleteTarget.name}
                    onConfirm={async () => {
                        try {
                            await fetch(`/api/resumes/${deleteTarget.id}`, { method: "DELETE" });
                            fetchResumes(page);
                        } catch (err) {
                            console.error("Error deleting resume:", err);
                        }
                        setDeleteTarget(null); // close modal
                    }}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            <div className="mt-6">
                <table className="w-full table-auto border-collapse border border-white/30 rounded-xl overflow-hidden">
                    <thead>
                        <tr className="bg-[#333] text-white text-center">
                            <th className="py-3 px-4">Candidate Name</th>
                            <th className="py-3 px-4">Uploaded Date</th>
                            <th className="py-3 px-4">File Type</th>
                            <th className="py-3 px-4">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resumes.length > 0 ? (
                            resumes.map((resume) => (
                                <tr key={resume.resume_id} className="border-t border-white/20 text-center h-[60px]">
                                    <td className="py-2 px-4 capitalize">{resume.candidate_name}</td>
                                    <td className="py-2 px-4">
                                        {resume.created_at
                                            ? new Date(resume.created_at).toLocaleString()
                                            : "—"}
                                    </td>
                                    <td className="py-2 px-4">
                                        <div className="flex justify-center">
                                            {resume.file_type === "pdf" ? (
                                                <span className="flex items-center gap-1 bg-cyan-400/20 text-cyan-500 font-semibold px-2 py-1.5 rounded-full">
                                                    <FilePdfIcon /> PDF
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 bg-blue-400/20 text-blue-500 font-semibold px-2 py-1.5 rounded-full">
                                                    <FileDocxIcon /> DOCX
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="py-2 px-4">
                                        <div className="flex justify-center items-center gap-4">
                                            <button
                                                onClick={() => handlePreview(resume.resume_id)}
                                                className="text-white/70 hover:text-white text-xl cursor-pointer"
                                            >
                                                <EyeIcon />
                                            </button>
                                            <button
                                                onClick={() => handlePrint(resume.resume_id)}
                                                className="text-white/70 hover:text-white text-xl cursor-pointer"
                                            >
                                                <PrintIcon />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget({ id: resume.resume_id, name: resume.candidate_name })}
                                                className="text-red-500 hover:text-red-700 text-xl cursor-pointer"
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="py-4 px-4 text-center" colSpan={4}>
                                    No resumes uploaded
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-between mt-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
                    >
                        Back
                    </button>
                    <button
                        disabled={!hasMore}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}
