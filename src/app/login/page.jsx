"use client";

import { useState } from "react";
import { FiLock, FiUser, FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                toast.success("Authentication successful");
                router.push("/");
                router.refresh();
            } else {
                toast.error(data.message || "Invalid credentials");
            }
        } catch (error) {
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors selection:bg-[#00845a]/10 selection:text-[#00845a]">

            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00845a]/5 dark:bg-[#00845a]/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 p-10 sm:p-14 rounded-[2.5rem] shadow-soft max-w-md w-full relative z-10 animate-in zoom-in-95 fade-in duration-500 transition-colors">

                <div className="text-center mb-10 space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00845a] text-white rounded-2xl shadow-lg shadow-[#00845a]/20 mb-4 transition-colors">
                        <FiLock className="text-3xl" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors">CVin Access</h1>
                    <p className="text-sm text-slate-500 dark:text-gray-400 font-medium transition-colors">Enter your secure credentials to enter the talent index.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 dark:text-gray-500 uppercase font-black tracking-widest px-1 transition-colors">Administrator Handle</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-300 dark:text-gray-600 group-focus-within:text-[#00845a] dark:group-focus-within:text-[#00b37a] transition-colors">
                                    <FiUser />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-700 dark:text-gray-200 outline-none ring-2 ring-transparent focus:ring-[#00845a]/20 dark:focus:ring-[#00b37a]/20 transition-all font-bold placeholder:text-slate-300 dark:placeholder:text-gray-600 shadow-inner"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 dark:text-gray-500 uppercase font-black tracking-widest px-1 transition-colors">Security Key</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-300 dark:text-gray-600 group-focus-within:text-[#00845a] dark:group-focus-within:text-[#00b37a] transition-colors">
                                    <FiLock />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-700 dark:text-gray-200 outline-none ring-2 ring-transparent focus:ring-[#00845a]/20 dark:focus:ring-[#00b37a]/20 transition-all font-bold placeholder:text-slate-300 dark:placeholder:text-gray-600 shadow-inner"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00845a] hover:bg-[#006e4a] dark:bg-[#00845a] dark:hover:bg-[#00b37a] text-white font-black text-xs uppercase tracking-[0.2em] py-4 rounded-2xl transition-all disabled:opacity-50 shadow-xl shadow-[#00845a]/20 dark:shadow-[#00b37a]/10 active:scale-95 flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? "Authenticating..." : <>Secure Login <FiArrowRight /></>}
                    </button>

                    <div className="text-center mt-6">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest transition-colors">
                            Protected by CVin Neural Sandbox
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
