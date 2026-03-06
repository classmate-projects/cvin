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
        fetchStats();
    }, []);

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Page Header Area */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
                        Welcome Back, Wolf Pixel 👋
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-gray-400 font-medium transition-colors">Your resume pool is growing. Let's find your next top talent!</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 px-4 py-2.5 rounded-xl shadow-sm text-xs font-bold text-slate-600 dark:text-gray-300 transition-colors">
                        <FiCalendar className="text-slate-400 dark:text-gray-500" /> 1 Nov - 7 Nov 2024
                    </div>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Dashboard Interaction Area (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Performance Trends Section (Mock Chart Area) */}
                    <div className="card-glass p-8 space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight transition-colors">Top Hiring Trends</h3>
                            <button className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
                                <FiMoreVertical />
                            </button>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-2 px-4 relative">
                            {/* Decorative Chart Bars for High-End Look */}
                            {[40, 70, 45, 90, 65, 80, 55, 75, 95, 45, 60, 85].map((h, i) => (
                                <div key={i} className="flex-1 bg-slate-50 dark:bg-[#1a1a1a] rounded-t-lg relative group transition-all hover:bg-emerald-50 dark:hover:bg-emerald-500/10 cursor-pointer">
                                    <div
                                        className="absolute bottom-0 inset-x-0 bg-[#00845a]/10 dark:bg-[#00845a]/30 group-hover:bg-[#00845a]/60 dark:group-hover:bg-[#00845a]/80 rounded-t-lg transition-all"
                                        style={{ height: `${h}%` }}
                                    ></div>
                                </div>
                            ))}
                            <div className="absolute inset-x-0 bottom-[-20px] flex justify-between px-4 text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest transition-colors">
                                <span>Aug 01, 2024</span>
                                <span>Aug 15, 2024</span>
                                <span>Aug 31, 2024</span>
                            </div>
                        </div>
                    </div>

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

                {/* Side Context Area (1/3 width) */}
                <div className="space-y-8">

                    {/* Calendar Widget Context */}
                    <div className="card-glass p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest transition-colors">January 2024</h4>
                            <div className="flex gap-2">
                                <button className="w-6 h-6 flex items-center justify-center rounded bg-slate-50 dark:bg-[#1a1a1a] text-slate-400 dark:text-gray-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-[#00845a] dark:hover:text-[#00b37a] transition-colors">{"<"}</button>
                                <button className="w-6 h-6 flex items-center justify-center rounded bg-[#00845a] text-white shadow-sm shadow-[#00845a]/20 transition-colors">{">"}</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-400 dark:text-gray-500 mb-4 tracking-tighter transition-colors">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                        <div className="grid grid-cols-7 text-center gap-y-4">
                            {[15, 16, 17, 18, 19, 20, 21].map((d, i) => (
                                <div key={i} className={`py-1 flex flex-col items-center group cursor-pointer`}>
                                    <span className={`text-sm font-black transition-colors ${d === 19 ? "text-white bg-[#00845a] w-8 h-8 flex items-center justify-center rounded-xl shadow-lg shadow-[#00845a]/20" : "text-slate-800 dark:text-gray-300 hover:text-[#00845a] dark:hover:text-[#00b37a]"}`}>
                                        {d}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 space-y-4">
                            <p className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest transition-colors">Upcoming Scans</p>
                            <CalendarItem
                                title="Finance Department Review"
                                time="12:00 - 01:00 PM"
                                color="border-emerald-500 dark:border-emerald-400"
                                avatars={["A", "B", "C"]}
                            />
                            <CalendarItem
                                title="Technical Interview Preparation"
                                time="03:00 - 04:30 PM"
                                color="border-blue-500 dark:border-blue-400"
                                avatars={["D", "E"]}
                            />
                        </div>
                    </div>

                    {/* Quick Access Utility Section */}
                    <div className="bg-gradient-to-br from-slate-900 to-black dark:from-[#111] dark:to-black p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-emerald-500/20 dark:bg-[#00845a]/20 rounded-full blur-3xl group-hover:bg-emerald-500/40 dark:group-hover:bg-[#00845a]/40 transition-colors"></div>
                        <h4 className="text-xl font-bold mb-2">Team Insight</h4>
                        <p className="text-xs text-slate-400 mb-6 leading-relaxed">Collaborate with your managers to review scanned profiles instantly. Faster hiring starts here.</p>
                        <button className="bg-white hover:bg-slate-100 text-black text-xs font-bold px-5 py-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                            <FiShare2 className="text-slate-400" /> Share Access
                        </button>
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
                    <FiMoreVertical />
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

function CalendarItem({ title, time, color, avatars }) {
    return (
        <div className={`pl-4 border-l-4 ${color} space-y-1 py-1 transition-colors`}>
            <h5 className="text-xs font-bold text-slate-800 dark:text-gray-200 transition-colors">{title}</h5>
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-medium text-slate-400 dark:text-gray-500 transition-colors">{time}</span>
                <div className="flex -space-x-1.5">
                    {avatars.map((a, i) => (
                        <div key={i} className="w-5 h-5 rounded-full border border-white dark:border-[#111111] bg-slate-100 dark:bg-[#1a1a1a] flex items-center justify-center text-[8px] font-bold text-slate-500 dark:text-gray-400 transition-colors">
                            {a}
                        </div>
                    ))}
                    <div className="w-5 h-5 rounded-full border border-white dark:border-[#111111] bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-[7px] font-black text-[#00845a] dark:text-[#00b37a] transition-colors">
                        +9
                    </div>
                </div>
            </div>
        </div>
    );
}