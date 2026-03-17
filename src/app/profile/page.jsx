"use client";

import { useEffect, useState } from "react";
import { FiLock, FiUser, FiShield, FiMail } from "react-icons/fi";
import { toast } from "react-toastify";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Password Form
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        if (passwords.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(passwords)
            });
            const data = await res.json();

            if (res.ok && data.success) {
                toast.success("Identity key rotated successfully!");
                setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                toast.error(data.message || "Key rotation failed.");
            }
        } catch (err) {
            toast.error("Network interface error.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return null; // Let the layout loader handle UI transition

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Identity Profile</h1>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-gray-400 font-medium">Manage your personal settings and security credentials.</p>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-[#1a1a1a] px-5 py-3 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm inline-flex">
                    <img src={user?.avatar} alt="Current Agent" className="w-10 h-10 rounded-full" />
                    <div>
                        <div className="text-sm font-black text-slate-800 dark:text-white">{user?.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user?.role}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Data Readonly */}
                <div className="card-glass p-8 bg-white dark:bg-[#151515] space-y-6">
                    <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-4 mb-6">Current Identity</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2 mb-1"><FiUser /> Registered Alias</label>
                            <div className="font-bold text-slate-800 dark:text-gray-200">{user?.name}</div>
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2 mb-1"><FiMail /> Communication Feed</label>
                            <div className="font-bold text-slate-800 dark:text-gray-200">{user?.email}</div>
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2 mb-1"><FiShield /> Clearance Level</label>
                            <div className="font-bold text-[#00845a] dark:text-[#00b37a] uppercase tracking-widest">{user?.role}</div>
                        </div>
                    </div>
                </div>

                {/* Password Change Form */}
                <form onSubmit={handlePasswordChange} className="card-glass p-8 bg-white dark:bg-[#151515] space-y-6">
                    <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-4 mb-6 flex items-center gap-2">
                        <FiLock /> Rotate Identity Key
                    </h2>

                    <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Current Password</label>
                        <input
                            name="currentPassword" type="password" value={passwords.currentPassword} onChange={handleChange} required
                            className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white outline-none ring-1 ring-transparent focus:ring-[#00845a]/30 transition-all font-mono"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">New Password</label>
                        <input
                            name="newPassword" type="password" value={passwords.newPassword} onChange={handleChange} required minLength={6}
                            className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white outline-none ring-1 ring-transparent focus:ring-[#00845a]/30 transition-all font-mono"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Confirm Password</label>
                        <input
                            name="confirmPassword" type="password" value={passwords.confirmPassword} onChange={handleChange} required minLength={6}
                            className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white outline-none ring-1 ring-transparent focus:ring-[#00845a]/30 transition-all font-mono"
                        />
                    </div>

                    <button
                        type="submit" disabled={isSubmitting}
                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 font-black text-xs uppercase tracking-[0.2em] py-4 rounded-xl transition-all disabled:opacity-50 active:scale-95 shadow-sm"
                    >
                        {isSubmitting ? "Changing password..." : "Change password"}
                    </button>
                </form>
            </div>
        </div>
    );
}