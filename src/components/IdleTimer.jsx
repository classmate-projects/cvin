"use client";

import { useState, useEffect, useCallback } from "react";
import { FiClock } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function IdleTimer({ timeoutMinutes = 5 }) {
    const [timeLeft, setTimeLeft] = useState(timeoutMinutes * 60);
    const router = useRouter();

    const logout = useCallback(async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
            router.refresh();
        } catch (err) {
            console.error("Logout failed", err);
        }
    }, [router]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    logout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        const resetTimer = () => setTimeLeft(timeoutMinutes * 60);

        // Track user activity
        const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
        events.forEach((event) => window.addEventListener(event, resetTimer));

        return () => {
            clearInterval(timer);
            events.forEach((event) => window.removeEventListener(event, resetTimer));
        };
    }, [timeoutMinutes, logout]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#1a1a1a] border border-slate-100 dark:border-white/10 rounded-xl shadow-sm transition-all group group-hover:border-[#00845a]/30 dark:group-hover:border-[#00b37a]/30">
            <FiClock className={`text-xs ${timeLeft < 60 ? "text-rose-500 animate-pulse" : "text-[#00845a] dark:text-[#00b37a]"} transition-colors`} />
            <div className="flex flex-col">
                <span className="text-[7px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-0.5">Idle In</span>
                <span className="text-[10px] font-bold text-slate-700 dark:text-gray-200 tabular-nums leading-none group-hover:text-[#00845a] dark:group-hover:text-[#00b37a] transition-colors">{formatTime(timeLeft)}</span>
            </div>
        </div>
    );
}
