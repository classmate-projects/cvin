"use client";

import { useEffect, useState, useCallback } from "react";
import {
    SearchIcon,
    FilePdfIcon,
    FileDocxIcon,
    EyeIcon,
    PrintIcon,
    DeleteIcon,
    EmptyIcon,
    ToLeftArrowIcon,
    ToRightArrowIcon,
} from "@/lib/icons";

export default function FindResume() {
    const [resumes, setResumes] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState("created_at"); // default sorting
    const [search, setSearch] = useState("");

    // fetch resumes with pagination + sorting + search
    const fetchResumes = useCallback(
        async (pageNum) => {
            try {
                setLoading(true);
                const res = await fetch(
                    `/api/resumes?page=${pageNum}&limit=50&sort=${sortBy}&search=${encodeURIComponent(
                        search
                    )}`
                );
                const data = await res.json();

                if (data.success) {
                    if (pageNum === 1) {
                        setResumes(data.resumes);
                    } else {
                        setResumes((prev) => [...prev, ...data.resumes]);
                    }
                    setHasMore(data.resumes.length === 50);
                }
            } catch (err) {
                console.error("Error fetching resumes:", err);
            } finally {
                setLoading(false);
            }
        },
        [sortBy, search]
    );

    // load resumes when page/sort/search changes
    useEffect(() => {
        fetchResumes(page);
    }, [page, sortBy, search, fetchResumes]);

    // infinite scroll listener
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 200 &&
                hasMore &&
                !loading
            ) {
                setPage((p) => p + 1);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, loading]);

    return (
        <main className="px-6 py-4 flex min-h-[90dvh]">
            <div className="mt-6 w-full">
                <h1 className="text-2xl font-bold">Resumes</h1>

                {/* search + sort */}
                <div className="mt-4">
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="w-full flex items-center justify-between gap-4 flex-wrap"
                    >
                        {/* Search */}
                        <div className="bg-[#222] px-4 py-2 rounded-md flex-1 flex items-center gap-4 text-xl w-3/4">
                            <SearchIcon className="text-xl" />
                            <input
                                type="search"
                                placeholder="Search by candidate name"
                                value={search}
                                onChange={(e) => {
                                    setPage(1);
                                    setSearch(e.target.value);
                                }}
                                className="w-full outline-0 bg-transparent"
                            />
                        </div>

                        {/* Sort by */}
                        <div className="flex items-center gap-4 w-1/4">
                            <span className="text-gray-300 font-bold">Sort by:</span>
                            <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sortby"
                                    value="name"
                                    checked={sortBy === "name"}
                                    onChange={() => {
                                        setPage(1);
                                        setSortBy("name");
                                    }}
                                />
                                <span className="text-gray-300">Name</span>
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sortby"
                                    value="created_at"
                                    checked={sortBy === "created_at"}
                                    onChange={() => {
                                        setPage(1);
                                        setSortBy("created_at");
                                    }}
                                />
                                <span className="text-gray-300">Date</span>
                            </label>
                        </div>
                    </form>
                </div>

                {/* table */}
                <div className="mt-6 border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full table-auto border-collapse border border-white/30 rounded-xl overflow-hidden">
                        <thead>
                            <tr className="bg-[#333] text-gray-300 font-extralight text-center">
                                <th className="py-3 px-4">Candidate Name</th>
                                <th className="py-3 px-4">Uploaded Date</th>
                                <th className="py-3 px-4">File Type</th>
                                <th className="py-3 px-4">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resumes.length > 0 ? (
                                resumes.map((resume) => (
                                    <tr
                                        key={resume.resume_id}
                                        className="border-t border-white/20 text-center h-[60px]"
                                    >
                                        <td className="py-2 px-4 capitalize">
                                            {resume.candidate_name}
                                        </td>
                                        <td className="py-2 px-4 uppercase">
                                            {resume.created_at
                                                ? new Date(resume.created_at).toLocaleString("en-GB", {
                                                    hour: "numeric",
                                                    minute: "numeric",
                                                    hour12: true,
                                                }) +
                                                ", " +
                                                new Date(resume.created_at)
                                                    .toLocaleDateString("en-GB")
                                                    .replaceAll("/", "-")
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
                                                <button className="text-white/70 hover:text-white text-xl cursor-pointer">
                                                    <EyeIcon />
                                                </button>
                                                <button className="text-white/70 hover:text-white text-xl cursor-pointer">
                                                    <PrintIcon />
                                                </button>
                                                <button className="text-red-500 hover:text-red-700 text-xl cursor-pointer">
                                                    <DeleteIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="py-4 px-4 text-center" colSpan={4}>
                                        <span className="flex flex-col gap-1 items-center justify-center pt-4 text-white/70">
                                            <EmptyIcon className="text-6xl" />
                                            <p>No resumes uploaded</p>
                                        </span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* manual pagination */}
                    <div className="flex justify-between mt-4">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="px-4 py-2 bg-gray-700 rounded flex gap-1 items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ToLeftArrowIcon /> Back
                        </button>
                        <button
                            disabled={!hasMore}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-4 py-2 bg-gray-700 rounded flex gap-1 items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next <ToRightArrowIcon />
                        </button>
                    </div>
                </div>

                {loading && <p className="mt-4 text-gray-400">Loading...</p>}
            </div>
        </main>
    );
}
