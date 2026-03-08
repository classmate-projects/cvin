"use client";

import { useState, useEffect } from "react";
import { FiMail, FiRefreshCw, FiCheckCircle, FiXCircle, FiEye, FiDownload } from "react-icons/fi";
import { toast } from "react-toastify";
import ReviewMetadata from "@/components/ReviewMetadata";

export default function EmailInbox() {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [selectedResume, setSelectedResume] = useState(null);

    useEffect(() => {
        fetchPendingEmails();
    }, []);

    const fetchPendingEmails = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/resumes?status=Pending&source=Email");
            const data = await res.json();
            if (data.success) {
                setEmails(data.resumes);
            }
        } catch (err) {
            toast.error("Failed to load email inbox");
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            const res = await fetch("/api/email/sync", { method: "POST" });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message || "Email sync complete!");
                fetchPendingEmails();
            } else {
                toast.info(data.message || "No new CVs found.");
            }
        } catch (err) {
            toast.error("Sync failed. Check email configuration.");
        } finally {
            setSyncing(false);
        }
    };

    const handleApprove = (resume) => {
        // Convert resume db structure to metadata format expected by ReviewMetadata
        setSelectedResume({
            ...resume,
            name: resume.candidate_name, // Map for ReviewMetadata compatibility
        });
    };

    const handleConfirmApproval = async (verifiedData) => {
        try {
            const res = await fetch(`/api/resumes/${selectedResume.resume_id}/approve`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(verifiedData)
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Profile approved and moved to Talent Discovery!");
                setSelectedResume(null);
                fetchPendingEmails();
            }
        } catch (err) {
            toast.error("Approval failed");
        }
    };

    const handleReject = async (id) => {
        if (!confirm("Are you sure you want to reject and delete this CV?")) return;
        try {
            const res = await fetch(`/api/resumes/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.warn("CV discarded.");
                fetchPendingEmails();
            }
        } catch (err) {
            toast.error("Failed to delete record");
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
            {selectedResume && (
                <ReviewMetadata
                    metadata={selectedResume}
                    onConfirm={handleConfirmApproval}
                    onCancel={() => setSelectedResume(null)}
                    isSubmitting={false}
                />
            )}

            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Email Ingestion</h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 font-medium">Monitoring incoming talent profiles from verified email channels</p>
                </div>
                <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="w-full sm:w-auto bg-[#00845a] dark:bg-[#00b37a]/10 dark:text-[#00b37a] dark:border dark:border-[#00b37a]/50 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-widest hover:bg-[#006e4a] dark:hover:bg-[#00b37a]/20 transition-all shadow-lg shadow-[#00845a]/20 disabled:opacity-50"
                >
                    <FiRefreshCw className={syncing ? "animate-spin" : ""} />
                    {syncing ? "Syncing Mailbox..." : "Sync Emails"}
                </button>
            </header>

            <div className="card-glass bg-white dark:bg-[#151515] overflow-hidden transition-colors p-0">
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-[#1a1a1a] text-slate-400 dark:text-gray-500 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5">
                                <th className="py-5 px-8 text-left">Candidate / Email</th>
                                <th className="py-5 px-8 text-left">Received</th>
                                <th className="py-5 px-8 text-center">Status</th>
                                <th className="py-5 px-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {emails.length > 0 ? (
                                emails.map((email) => (
                                    <tr key={email.resume_id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="py-6 px-8">
                                            <div className="font-bold text-slate-800 dark:text-white text-sm">
                                                {email.candidate_name || "New Candidate"}
                                            </div>
                                            <div className="text-[10px] text-slate-400 dark:text-gray-500 italic mt-0.5">
                                                {email.sender_email || "unknown@provider.com"}
                                            </div>
                                        </td>
                                        <td className="py-6 px-8 text-xs text-slate-500 dark:text-gray-400">
                                            {new Date(email.created_at).toLocaleString()}
                                        </td>
                                        <td className="py-6 px-8 text-center">
                                            <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black px-2.5 py-1 rounded-lg border border-amber-100 dark:border-amber-500/20">
                                                Pending Review
                                            </span>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleApprove(email)}
                                                    className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-[#00845a] dark:text-[#00b37a] rounded-xl border border-emerald-100 dark:border-emerald-500/20 hover:scale-105 transition-all"
                                                    title="Review & Approve"
                                                >
                                                    <FiCheckCircle className="text-lg" />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(email.resume_id)}
                                                    className="p-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl border border-rose-100 dark:border-rose-500/20 hover:scale-105 transition-all"
                                                    title="Reject"
                                                >
                                                    <FiXCircle className="text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-24 text-center">
                                        <FiMail className="text-5xl text-slate-200 dark:text-white/5 mx-auto mb-4" />
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Inbox Clean</p>
                                        <p className="text-xs text-slate-400/60">Ready to ingest new talent documents via IMAP sync.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
