"use client";

import { useEffect, useState } from "react";

export default function UploadedResume() {
    const [resumes, setResumes] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    // Fetch resumes (latest 10 per page)
    const fetchResumes = async (pageNum = 1) => {
        try {
            const res = await fetch(`/api/resumes?page=${pageNum}`);
            const data = await res.json();

            // Defensive checks
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

        // Poll every 5s for realtime updates
        const interval = setInterval(() => {
            fetchResumes(page);
        }, 5000);

        return () => clearInterval(interval);
    }, [page]);

    const handlePreview = (id) => {
        window.open(`/api/resumes/${id}/preview`, "_blank");
    };

    const handlePrint = (id) => {
        window.open(`/api/resumes/${id}/print`, "_blank");
    };

    const handleDelete = async (id) => {
        if (confirm("Delete this resume?")) {
            try {
                await fetch(`/api/resumes/${id}`, { method: "DELETE" });
                fetchResumes(page);
            } catch (err) {
                console.error("Error deleting resume:", err);
            }
        }
    };

    return (
        <div className="mt-6">
            <table className="w-full border-white/70 rounded-xl overflow-hidden">
                <thead>
                    <tr className="bg-[#333] text-left">
                        <th className="py-3 px-4">Candidate Name</th>
                        <th className="py-3 px-4">Uploaded Date</th>
                        <th className="py-3 px-4">File Type</th>
                        <th className="py-3 px-4">Options</th>
                    </tr>
                </thead>
                <tbody>
                    {resumes.length > 0 ? (
                        resumes.map((resume) => (
                            <tr key={resume.resume_id} className="border-t border-white/20">
                                <td className="py-2 px-4">{resume.candidate_name}</td>
                                <td className="py-2 px-4">
                                    {resume.created_at
                                        ? new Date(resume.created_at).toLocaleString()
                                        : "—"}
                                </td>
                                <td className="py-2 px-4">{resume.file_type || "Unknown"}</td>
                                <td className="py-2 px-4 space-x-2">
                                    <button
                                        onClick={() => handlePreview(resume.resume_id)}
                                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                                    >
                                        Preview
                                    </button>
                                    <button
                                        onClick={() => handlePrint(resume.resume_id)}
                                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                                    >
                                        Print
                                    </button>
                                    <button
                                        onClick={() => handleDelete(resume.resume_id)}
                                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                                    >
                                        Delete
                                    </button>
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
    );
}
