"use client";

import { useState } from "react";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                toast.success("Password reset instructions sent to your email.");
                setTimeout(() => router.push("/login"), 2000);
            } else {
                toast.error(data.message || "Cannot find that identity.");
            }
        } catch (error) {
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-[#070707] transition-colors selection:bg-[#00845a]/20 selection:text-[#00845a]">
            {/* Rich Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#00845a]/10 dark:bg-[#00845a]/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen"></div>
            </div>

            {/* Glassmorphism Card */}
            <div className="w-full max-w-[440px] px-6 py-10 sm:p-14 relative z-10 animate-in zoom-in-95 fade-in duration-700 mx-4 sm:mx-0">
                <div className="absolute inset-0 bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/60 dark:border-white/10 shadow-2xl -z-10"></div>

                <div className="mb-10 sm:mb-12">
                    <Link href="/login" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#00845a] hover:text-[#00b37a] mb-6 transition-colors">
                        <FiArrowLeft /> Return to Gateway
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-tight drop-shadow-sm mb-2">Reset Identity</h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Enter your registered email address to receive secure reset instructions.</p>
                </div>

                <form onSubmit={handleReset} className="space-y-8">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-slate-400 dark:text-gray-500 group-focus-within:text-[#00845a] dark:group-focus-within:text-[#00b37a] transition-colors pb-1">
                            <FiMail className="text-lg" />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-slate-300 dark:border-white/20 pl-8 pr-4 py-2.5 text-base text-slate-800 dark:text-white outline-none focus:border-[#00845a] dark:focus:border-[#00b37a] transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500 font-bold"
                            placeholder="agent@cvin.system"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00845a] dark:bg-[#00b37a] text-white hover:bg-[#006e4a] dark:hover:bg-[#009c6a] font-black text-sm uppercase tracking-widest py-4 rounded-2xl transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-[#00845a]/20"
                    >
                        {loading ? "Transmitting..." : "Send Reset Link"}
                    </button>
                </form>
            </div>
        </div>
    );
}
