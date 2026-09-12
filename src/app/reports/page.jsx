"use client";

import { useEffect, useState } from "react";
import {
    FiBarChart2,
    FiPieChart,
    FiTrendingUp,
    FiActivity,
    FiFileText,
    FiMail,
    FiUploadCloud,
} from "react-icons/fi";
import {
    BarListWidget,
    DonutWidget,
    TrendChartWidget,
    PipelineWidget,
} from "@/components/StatWidgets";

export default function ReportsPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/stats");
                const data = await res.json();
                if (data.success) setStats(data.stats);
            } catch (err) {
                console.error("Stats fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const categories = (stats?.categories || []).map((c) => ({ label: c.job_title, count: c.count }));
    const formats = (stats?.formats || []).map((f) => ({ label: f.file_type || "Unknown", count: f.count }));
    const sources = Object.entries(stats?.sourceCounts || {}).map(([label, count]) => ({ label, count }));

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <FiBarChart2 className="text-[#00845a] dark:text-[#00b37a]" />
                        Reports &amp; Analytics
                    </h1>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-gray-400 font-medium">
                        A live breakdown of every resume that has moved through your pipeline.
                    </p>
                </div>
            </header>

            {loading ? (
                <div className="w-full h-[50vh] flex flex-col items-center justify-center animate-in fade-in duration-500">
                    <FiActivity className="text-4xl text-[#00845a] dark:text-[#00b37a] animate-pulse mb-4" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Crunching the numbers...</span>
                </div>
            ) : (
                <>
                    {/* KPI Summary */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <SummaryCard label="Total Resumes" value={stats?.total ?? 0} icon={<FiFileText />} />
                        <SummaryCard label="Added This Week" value={stats?.recent ?? 0} icon={<FiTrendingUp />} />
                        <SummaryCard label="Departments Tracked" value={stats?.categories?.length ?? 0} icon={<FiPieChart />} />
                        <SummaryCard label="Approved Candidates" value={stats?.statusCounts?.Approved ?? 0} icon={<FiActivity />} />
                    </div>

                    {/* Trend + Pipeline */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <TrendChartWidget
                            title="7-Day Intake Trend"
                            icon={<FiTrendingUp />}
                            items={stats?.weeklyTrend || []}
                            className="lg:col-span-2"
                        />
                        <PipelineWidget
                            title="Review Pipeline"
                            icon={<FiActivity />}
                            statusCounts={stats?.statusCounts || {}}
                        />
                    </div>

                    {/* Categories + Formats + Source */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <BarListWidget
                            title="Top Job Categories"
                            icon={<FiBarChart2 />}
                            items={categories}
                            emptyLabel="No job categories detected yet"
                        />
                        <DonutWidget
                            title="File Format Mix"
                            icon={<FiPieChart />}
                            items={formats}
                            emptyLabel="No files processed yet"
                        />
                        <BarListWidget
                            title="Intake Source"
                            icon={sources.some((s) => s.label === "Email") ? <FiMail /> : <FiUploadCloud />}
                            items={sources}
                            emptyLabel="No intake source data yet"
                        />
                    </div>
                </>
            )}
        </div>
    );
}

function SummaryCard({ label, value, icon }) {
    return (
        <div className="card-glass p-5 md:p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-[#00845a] dark:text-[#00b37a] flex items-center justify-center text-lg">
                {icon}
            </div>
            <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{value}</h2>
                <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mt-1.5">{label}</p>
            </div>
        </div>
    );
}
