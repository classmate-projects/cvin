"use client";

import { useRef, useState } from "react";
import { BackArrowIcon, CloudUploadIcon, FileAddIcon, FileCancelIcon } from "@/lib/icons";

import { toast } from "react-toastify";


export default function UploadResume() {
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [candidateName, setCandidateName] = useState("");
    const fileInputRef = useRef(null);


    const handleFile = (files) => {
        if (!files || files.length === 0) return;

        const allowed = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        const selected = files[0];
        if (!allowed.includes(selected.type)) {
            alert("Only PDF and DOCX files are allowed!");
            return;
        }

        setFile(selected);
        setIsFileSelected(true)
        console.log("File uploaded:", selected);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file || !candidateName.trim()) {
            toast.warn("Please enter candidate name")
            return;
        }

        // TODO: send file + candidateName to database
        console.log("Submitting:", { candidateName, file });
    };

    const handleCancelFileSelected = () => {
        setFile(null)
        setIsFileSelected(false)
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-baseline sm:items-center">
                <h2 className="text-2xl font-bold">Manage Resumes</h2>
                {isFileSelected ? (
                    <button
                        onClick={handleCancelFileSelected}
                        className="flex items-center gap-2 bg-red-800 px-4 py-2 rounded-md cursor-pointer hover:bg-red-700 transition-colors duration-150 ease-in-out">
                        <FileCancelIcon /> Cancel
                    </button>
                ) : (
                    <button
                        onClick={triggerFileInput}
                        className="flex items-center gap-2 bg-cyan-800 px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-700 transition-colors duration-150 ease-in-out"
                    >
                        <FileAddIcon /> Upload Resume
                    </button>
                )}

            </div>

            {/* If file is selected, show preview + form */}
            {isFileSelected ? (
                <form
                    onSubmit={handleSubmit}
                    className="mt-8 flex flex-col justify-center items-center gap-4 border border-white/20 w-full bg-[#191919] px-6 py-15 rounded-md"
                >
                    <div className="text-green-400 text-sm text-center">
                        Selected File: <b>{file.name}</b>
                    </div>
                    <div className=" w-full max-w-[576px]">
                        <input
                            type="text"
                            placeholder="Enter candidate name"
                            value={candidateName}
                            onChange={(e) => setCandidateName(e.target.value)}
                            className="px-3 py-2 rounded-md bg-gray-800 text-white outline-0 w-full"
                        />
                    </div>
                    <div className=" flex gap-2 items-center">
                        <button
                            onClick={handleCancelFileSelected}
                            className="bg-red-600/60 px-4 py-2 rounded-md font-bold hover:bg-red-700 transition-colors duration-150 ease-in-out cursor-pointer flex items-center gap-1">
                            <BackArrowIcon className=" text-xl" /> Go back
                        </button>
                        <button
                            type="submit"
                            className="bg-cyan-800 px-4 py-2 rounded-md font-bold hover:bg-cyan-700 transition-colors duration-150 ease-in-out cursor-pointer"
                        >
                            Submit
                        </button>
                    </div>

                </form>
            ) : (
                // Else show drag-drop area
                <div
                    className={`mt-8 flex justify-center items-center flex-col gap-1 border-3 border-dashed w-full bg-[#191919] px-6 py-15 rounded-md ${dragActive ? "border-cyan-500" : "border-white/20"
                        }`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                >
                    <CloudUploadIcon className="text-white/60 text-5xl mb-6" />
                    <div className=" flex flex-col gap-1">
                        <p className="font-bold text-center">
                            Drag and drop your resume or click to upload
                        </p>
                        <p className="text-sm opacity-80 text-center">Supported formats: PDF, DOCX</p>
                    </div>
                    <button
                        onClick={triggerFileInput}
                        type="button"
                        className="bg-gray-500/50 cursor-pointer mt-6 px-4 py-2 rounded-md text-cyan-600 font-bold"
                    >
                        Browse Files
                    </button>
                    <input
                        type="file"
                        accept=".pdf,.docx"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files)}
                    />
                </div>
            )}
        </div>
    );
}
