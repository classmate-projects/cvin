"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    DashboardIcon,
    SearchIcon,
    FileAddIcon,
    FileIcon,
    BackArrowIcon
} from "@/lib/icons";
import {
    FiCheckSquare,
    FiFileText,
    FiMail,
    FiCalendar,
    FiBarChart2,
    FiUsers,
    FiUserPlus,
    FiMenu,
    FiRefreshCw
} from "react-icons/fi";


export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path) => pathname === path;

    const [pendingCount, setPendingCount] = useState(0);
    const [syncing, setSyncing] = useState(false);

    const handleManualSync = async () => {
        if (syncing) return;
        setSyncing(true);
        try {
            const res = await fetch("/api/email/sync", { method: "POST" });
            const data = await res.json();
            if (data.success) {
                const countRes = await fetch("/api/resumes?status=Pending&source=Email&limit=1");
                const countData = await countRes.json();
                setPendingCount(countData.resumes?.length || 0);
            }
        } catch (e) {
            console.error("Background sync failed", e);
        } finally {
            setSyncing(false);
        }
    };

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await fetch("/api/resumes?status=Pending&source=Email&limit=1");
                const { resumes } = await res.json();
                // Simple hack for now: if we have any, we show a badge. 
                // In a real app we'd use a separate count API.
                setPendingCount(resumes?.length || 0);
            } catch (e) { }
        };
        fetchCount();
        const interval = setInterval(fetchCount, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);


    return (
        <>
            {/* Hamburger Button (Mobile Only) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`lg:hidden fixed top-3 left-4 z-[60] p-2 bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-xl shadow-sm transition-all ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                <FiMenu className="text-xl text-slate-700 dark:text-gray-300" />
            </button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 dark:bg-black/40 z-[45] lg:hidden backdrop-blur-sm transition-all"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`w-72 bg-white dark:bg-[#111111] h-[100dvh] border-r border-slate-100 dark:border-white/5 flex flex-col p-4 md:p-6 fixed inset-y-0 left-0 lg:relative z-50 transition-transform duration-300 shadow-soft ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Logo Section */}
                <div className="flex items-center justify-between mb-8 px-2 transition-colors">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#00845a] dark:bg-[#00b37a] rounded-lg flex items-center justify-center text-white shadow-lg transition-colors">
                            <FileIcon className="text-sm" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white transition-colors">CViN</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 p-1 bg-slate-50 dark:bg-white/5 rounded transition-colors">
                        <BackArrowIcon />
                    </button>
                </div>

                {/* Navigation Menus */}
                <div className="flex-1 space-y-8 overflow-y-auto scrollbar-hide">
                    {/* Main Menu */}
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 px-2 transition-colors">Main Menu</h3>
                        <div className="space-y-1">
                            <SidebarItem
                                icon={<DashboardIcon />}
                                label="Dashboard"
                                href="/"
                                active={isActive("/")}
                            />

                            <SidebarItem
                                icon={<FiMail />}
                                label="Email"
                                href="/email-inbox"
                                active={isActive("/email-inbox")}
                                badge={pendingCount > 0 ? pendingCount : null}
                            />

                        </div>
                    </div>

                    {/* Operations Menu */}
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 px-2 transition-colors">Candidates</h3>
                        <div className="space-y-1">
                            <SidebarItem
                                icon={<SearchIcon />}
                                label="Find Resume"
                                href="/find-resume"
                                active={isActive("/find-resume")}
                            />
                            <SidebarItem
                                icon={<FileAddIcon />}
                                label="Upload New"
                                href="/upload"
                                active={isActive("/upload")}
                            />
                            <SidebarItem
                                icon={<FiUsers />}
                                label="Talent Pool"
                                href="/talent-pool"
                                active={isActive("/talent-pool")}
                            />
                            <SidebarItem
                                icon={<FiUserPlus />}
                                label="Invite Team"
                                href="/invite-team"
                                active={isActive("/invite-team")}
                            />
                        </div>
                    </div>

                    {/* System Menu */}
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 px-2 transition-colors">System</h3>
                        <div className="space-y-1">
                            <SidebarItem
                                icon={<FiBarChart2 />}
                                label="Reports"
                                href="/reports"
                                active={isActive("/reports")}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer / Active Sessions & Background Tasks */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/5 transition-colors">
                    {syncing && (
                        <div className="mb-6 px-2 animate-in slide-in-from-bottom-2 duration-500">
                            <div className="bg-emerald-50/50 dark:bg-emerald-500/5 rounded-2xl p-4 border border-emerald-100/50 dark:border-emerald-500/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-20">
                                    <FiRefreshCw className="text-2xl animate-spin text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="flex items-start gap-3 relative z-10">
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1a1a1a] shadow-sm flex items-center justify-center">
                                        <FiMail className="text-xs text-emerald-600 dark:text-emerald-400 animate-pulse" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-1">Neural Sync Active</p>
                                        <div className="w-full bg-emerald-100 dark:bg-emerald-500/20 h-1 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 w-1/2 rounded-full animate-[loading-bar_1.5s_infinite_ease-in-out]"></div>
                                        </div>
                                    </div>
                                </div>
                                <style jsx>{`
                                    @keyframes loading-bar {
                                        0% { transform: translateX(-100%); width: 30%; }
                                        50% { width: 60%; }
                                        100% { transform: translateX(400%); width: 30%; }
                                    }
                                `}</style>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-3 px-2 mb-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest transition-colors">Active Sessions</span>
                            <button
                                onClick={handleManualSync}
                                disabled={syncing}
                                className={`p-1.5 rounded-lg transition-all ${syncing ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                                title="Run manual sync"
                            >
                                <FiRefreshCw className={`text-xs ${syncing ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                        <div className="flex -space-x-2 relative group cursor-pointer" title="Active Sessions: 1">
                            <div className="relative z-[1] hover:z-10 transition-transform hover:scale-110">
                                <img
                                    src="https://ui-avatars.com/api/?name=Auth&background=00845a&color=fff"
                                    alt="Admin"
                                    className="w-10 h-10 rounded-full border-2 border-white dark:border-[#111111] ring-2 ring-slate-50 dark:ring-white/5 transition-colors"
                                />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#111111] rounded-full"></span>
                            </div>
                        </div>
                    </div>
                </div>

            </aside>
        </>
    );
}

function SidebarItem({ icon, label, href, active, badge }) {
    return (
        <Link
            href={href}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 group outline-none ${active
                ? "bg-[#00845a] text-white shadow-lg shadow-[#00845a]/20"
                : "text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white"
                }`}
        >
            <div className="flex items-center gap-3">
                <span className={`text-lg transition-colors ${active ? "text-white" : "text-slate-400 dark:text-gray-500 group-hover:text-[#00845a] dark:hover:group-hover:text-[#00b37a]"}`}>
                    {icon}
                </span>
                <span className="text-sm font-bold">{label}</span>
            </div>
            {badge && (
                <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full transition-all animate-pulse shadow-sm">
                    {badge}
                </span>
            )}
        </Link>
    );
}
