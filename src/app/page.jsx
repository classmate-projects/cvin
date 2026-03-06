"use client";

import { useEffect, useState } from "react";
import UploadedResume from "@/components/UploadedResume";
import Link from "next/link";
import {
    FiTrendingUp,
    FiFileText,
    FiCheckCircle,
    FiClock,
    FiArrowRight,
    FiCalendar,
    FiPlus,
    FiShare2,
    FiMoreVertical
} from "react-icons/fi";

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [user, setUser] = useState({ name: "Team" });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/stats");
                const data = await res.json();
                if (data.success) setStats(data.stats);
            } catch (err) {
                console.error("Stats fetch error:", err);
            }
        };

        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    if (data.user) setUser(data.user);
                }
            } catch (err) { }
        };

        fetchStats();
        fetchUser();
    }, []);

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Page Header Area */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
                        Welcome Back, {user.name} 👋
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-gray-400 font-medium transition-colors">Your resume pool is growing. Let's find your next top talent!</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* <div className="flex items-center gap-2 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 px-4 py-2.5 rounded-xl shadow-sm text-xs font-bold text-slate-600 dark:text-gray-300 transition-colors">
                        <FiCalendar className="text-slate-400 dark:text-gray-500" /> 1 Nov - 7 Nov 2024
                    </div> */}
                    <Link
                        href="/upload"
                        className="flex items-center gap-2 bg-[#00845a] hover:bg-[#006e4a] text-white px-6 py-2.5 rounded-xl shadow-lg shadow-[#00845a]/20 transition-all font-bold active:scale-95 translate-y-0.5 group tracking-wide"
                    >
                        <FiPlus className="text-lg group-hover:rotate-90 transition-transform" />
                        Add New
                    </Link>
                </div>
            </header>

            {/* Core KPI Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard
                    icon={<FiFileText className="text-emerald-600 dark:text-emerald-400" />}
                    iconBg="bg-emerald-50 dark:bg-emerald-500/10"
                    trendColor="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                    value={stats?.total || "0"}
                    label="Total Resumes Scanned"
                    trend="+12% increase"
                />
                <KPICard
                    icon={<FiCheckCircle className="text-blue-600 dark:text-blue-400" />}
                    iconBg="bg-blue-50 dark:bg-blue-500/10"
                    trendColor="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10"
                    value={stats?.recent || "0"}
                    label="Active This Week"
                    trend="New scans"
                />
                <KPICard
                    icon={<FiTrendingUp className="text-orange-600 dark:text-orange-400" />}
                    iconBg="bg-orange-50 dark:bg-orange-500/10"
                    trendColor="text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10"
                    value={stats?.categories?.length || "0"}
                    label="Unique Departments"
                    trend="Broad scope"
                />
            </div>

            {/* Centerpiece Content: Data Visualization and Talent Activity */}
            <div className="w-full">
                {/* Talent History Area */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3 transition-colors">
                            <span className="w-1.5 h-6 bg-[#00845a] dark:bg-[#00b37a] rounded-full transition-colors"></span>
                            Recent Scans & Verification
                        </h3>
                        <Link href="/find-resume" className="text-xs font-bold text-[#00845a] dark:text-[#00b37a] hover:underline flex items-center gap-1 group transition-colors">
                            Discover All Talent <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="card-glass overflow-hidden shadow-soft p-0">
                        <UploadedResume />
                    </div>
                </div>
            </div>
        </div>
    );
}

function KPICard({ icon, iconBg, value, label, trend, trendColor }) {
    return (
        <div className="card-glass p-6 flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <button className="p-1 text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                    {/* <FiMoreVertical /> */}
                </button>
            </div>
            <div>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2 transition-colors">{value}</h2>
                <p className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest transition-colors">{label}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between transition-colors">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md transition-colors ${trendColor}`}>{trend}</span>
                <Link href="#" className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors group/link">
                    View list <FiArrowRight className="group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
            </div>
        </div>
    );
}

