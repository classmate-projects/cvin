"use client";

import { useState } from "react";
import { FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileIcon } from "@/lib/icons";

const FEATURES = [
    {
        title: "AI Resume Intelligence",
        desc: "Every resume is parsed, scored, and enriched automatically the moment it lands.",
    },
    {
        title: "Unified Talent Pool",
        desc: "Search, filter, and shortlist candidates from every channel in one place.",
    },
    {
        title: "Zero-Touch Inbox Sync",
        desc: "Incoming applicant emails are captured and queued for review in real time.",
    },
];

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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
        <div className="min-h-screen flex bg-slate-50 dark:bg-[#070707] transition-colors selection:bg-[#00845a]/20 selection:text-[#00845a]">

            {/* Left Branding Panel */}
            <div className="hidden lg:flex lg:w-[46%] xl:w-[42%] relative overflow-hidden bg-[#062c22] dark:bg-[#04140f]">
                {/* Atmospheric gradient blobs */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-15%] left-[-10%] w-[70%] h-[70%] bg-[#00845a]/40 rounded-full blur-[130px]"></div>
                    <div className="absolute bottom-[-20%] right-[-15%] w-[70%] h-[70%] bg-emerald-500/20 rounded-full blur-[150px]"></div>
                    <div className="absolute top-[35%] right-[5%] w-[45%] h-[45%] bg-teal-400/10 rounded-full blur-[120px]"></div>
                </div>

                {/* Subtle grid texture */}
                <div
                    className="absolute inset-0 opacity-[0.07] pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                        backgroundSize: "44px 44px",
                    }}
                ></div>

                <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full text-white animate-in fade-in slide-in-from-left-4 duration-700">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-lg">
                            <FileIcon className="text-lg" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">CViN</span>
                    </div>

                    <div className="space-y-10 max-w-md">
                        <div className="space-y-4">
                            <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300/80 bg-emerald-400/10 border border-emerald-300/20 px-3 py-1.5 rounded-full">
                                Talent Intelligence Platform
                            </span>
                            <h1 className="text-4xl xl:text-[2.75rem] font-black leading-[1.1] tracking-tight">
                                Find your next hire, faster than ever.
                            </h1>
                            <p className="text-sm text-emerald-50/70 font-medium leading-relaxed">
                                Sign in to manage your candidate pipeline, review incoming resumes, and keep your hiring engine running.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {FEATURES.map((f) => (
                                <div key={f.title} className="flex items-start gap-4 group">
                                    <div className="w-9 h-9 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mt-0.5 group-hover:bg-emerald-400/20 group-hover:border-emerald-300/30 transition-colors">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{f.title}</p>
                                        <p className="text-xs text-emerald-50/60 font-medium mt-0.5 leading-relaxed">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-50/40">
                        © {new Date().getFullYear()} CViN &mdash; Advanced Talent Management
                    </p>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="flex-1 flex items-center justify-center relative overflow-hidden px-4 sm:px-0">
                {/* Soft ambient glow on the form side too */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none lg:hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#00845a]/10 dark:bg-[#00845a]/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen"></div>
                </div>
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#00845a]/5 dark:bg-[#00845a]/10 rounded-full blur-[100px] pointer-events-none hidden lg:block"></div>

                <div className="w-full max-w-[420px] px-6 py-10 sm:p-12 relative z-10 animate-in zoom-in-95 fade-in duration-700 mx-4 sm:mx-0">
                    {/* Glass Background Layer */}
                    <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/60 dark:border-white/10 shadow-2xl -z-10"></div>

                    {/* Mobile-only logo */}
                    <div className="lg:hidden flex items-center gap-2.5 mb-10 justify-center">
                        <div className="w-9 h-9 bg-[#00845a] dark:bg-[#00b37a] rounded-xl flex items-center justify-center text-white shadow-lg">
                            <FileIcon className="text-sm" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">CViN</span>
                    </div>

                    <div className="mb-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#00845a] dark:text-[#00b37a]">Welcome back</span>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-tight mt-2">Sign in to CViN</h1>
                        <p className="text-sm text-slate-500 dark:text-gray-400 font-medium mt-2">Enter your credentials to access the recruiting workspace.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Username Input */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 dark:text-gray-500 font-black uppercase tracking-widest pl-1">Email or Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 dark:text-gray-500 group-focus-within:text-[#00845a] dark:group-focus-within:text-[#00b37a] transition-colors">
                                    <FiUser className="text-base" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-white/70 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-800 dark:text-white outline-none focus:border-[#00845a] dark:focus:border-[#00b37a] focus:ring-4 focus:ring-[#00845a]/10 dark:focus:ring-[#00b37a]/10 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500 font-bold shadow-sm"
                                    placeholder="you@company.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between pl-1 pr-1">
                                <label className="text-[10px] text-slate-400 dark:text-gray-500 font-black uppercase tracking-widest">Password</label>
                                <Link href="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-[#00845a] hover:text-[#00b37a] transition-colors">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 dark:text-gray-500 group-focus-within:text-[#00845a] dark:group-focus-within:text-[#00b37a] transition-colors">
                                    <FiLock className="text-base" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/70 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl pl-11 pr-12 py-3.5 text-sm text-slate-800 dark:text-white outline-none focus:border-[#00845a] dark:focus:border-[#00b37a] focus:ring-4 focus:ring-[#00845a]/10 dark:focus:ring-[#00b37a]/10 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500 font-bold shadow-sm"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-white transition-colors"
                                >
                                    {showPassword ? <FiEye className="text-lg" /> : <FiEyeOff className="text-lg" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-[#00845a] dark:bg-[#00b37a] hover:bg-[#006e4a] dark:hover:bg-[#009c6a] text-white font-black text-sm uppercase tracking-widest py-4 rounded-2xl transition-all disabled:opacity-50 active:scale-95 mt-2 shadow-lg shadow-[#00845a]/25 dark:shadow-[#00b37a]/15 group"
                        >
                            {loading ? "Authenticating..." : (
                                <>
                                    Sign In
                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-6 border-t border-slate-200/70 dark:border-white/5 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500">
                            Secured Access &middot; Authorized Personnel Only
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
