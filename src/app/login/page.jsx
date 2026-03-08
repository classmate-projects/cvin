"use client";

import { useState } from "react";
import { FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
                router.push("/find-resume");
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
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-[#070707] transition-colors selection:bg-[#00845a]/20 selection:text-[#00845a]">
            {/* Rich Background mimicking the reference's atmospheric landscape feel */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#00845a]/10 dark:bg-[#00845a]/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen"></div>
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-teal-400/10 dark:bg-teal-900/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>
            </div>



            {/* Glassmorphism Card */}
            <div className="w-full max-w-[440px] px-6 py-10 sm:p-14 relative z-10 animate-in zoom-in-95 fade-in duration-700 mx-4 sm:mx-0">
                {/* Glass Background Layer */}
                <div className="absolute inset-0 bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/60 dark:border-white/10 shadow-2xl -z-10"></div>


                <div className="text-center mb-10 sm:mb-12">
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-800 dark:text-white tracking-tight drop-shadow-sm">Login</h1>
                </div>

                <form onSubmit={handleLogin} className="space-y-8">
                    {/* Username Input - Underline Style */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-slate-400 dark:text-gray-500 group-focus-within:text-[#00845a] dark:group-focus-within:text-[#00b37a] transition-colors pb-1">
                            <FiUser className="text-lg" />
                        </div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-slate-300 dark:border-white/20 pl-8 pr-4 py-2.5 text-base text-slate-800 dark:text-white outline-none focus:border-[#00845a] dark:focus:border-[#00b37a] transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500 font-bold"
                            placeholder="Email or Username"
                            required
                        />
                    </div>

                    {/* Password Input - Underline Style */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-slate-400 dark:text-gray-500 group-focus-within:text-[#00845a] dark:group-focus-within:text-[#00b37a] transition-colors pb-1">
                            <FiLock className="text-lg" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-slate-300 dark:border-white/20 pl-8 pr-12 py-2.5 text-base text-slate-800 dark:text-white outline-none focus:border-[#00845a] dark:focus:border-[#00b37a] transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500 font-bold"
                            placeholder="Password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-white transition-colors pb-1"
                        >
                            {showPassword ? <FiEye className="text-xl" /> : <FiEyeOff className="text-xl" />}
                        </button>
                    </div>

                    <div className="flex justify-end">
                        <Link href="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-[#00845a] hover:text-[#00b37a] transition-colors">
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-transparent border-2 border-slate-800 dark:border-white text-slate-800 dark:text-white hover:bg-slate-800 dark:hover:bg-white hover:text-white dark:hover:text-black font-black text-sm uppercase tracking-widest py-4 rounded-2xl transition-all disabled:opacity-50 active:scale-95 mt-6 shadow-sm hover:shadow-lg"
                    >
                        {loading ? "Authenticating..." : "Login"}
                    </button>


                </form>
            </div>
        </div>
    );
}
