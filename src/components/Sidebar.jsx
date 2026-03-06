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
    FiUserPlus
} from "react-icons/fi";

export default function Sidebar() {
    const pathname = usePathname();
    const [user, setUser] = useState({
        name: "Loading Session...",
        email: "...",
        avatar: "https://ui-avatars.com/api/?name=Auth&background=00845a&color=fff"
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    if (data.user) setUser(data.user);
                }
            } catch (err) { }
        };
        fetchUser();
    }, []);

    const isActive = (path) => pathname === path;

    return (
        <aside className="w-72 bg-white dark:bg-[#111111] h-screen border-r border-slate-100 dark:border-white/5 flex flex-col p-6 fixed lg:relative z-40 transition-colors duration-300 shadow-soft">
            {/* Logo Section */}
            <div className="flex items-center justify-between mb-8 px-2 transition-colors">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#00845a] dark:bg-[#00b37a] rounded-lg flex items-center justify-center text-white shadow-lg transition-colors">
                        <FileIcon className="text-sm" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white transition-colors">CVin</span>
                </div>
                <button className="lg:hidden text-slate-400 p-1 hover:bg-slate-50 dark:hover:bg-white/5 rounded transition-colors">
                    <BackArrowIcon />
                </button>
            </div>

            {/* Global Search Interface */}
            <div className="relative mb-8 group transition-colors">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none group-focus-within:text-[#00845a] dark:group-focus-within:text-[#00b37a]">
                    <SearchIcon className="text-slate-400 text-sm transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-xl pl-10 py-2.5 text-xs text-slate-700 dark:text-gray-300 focus:ring-2 focus:ring-[#00845a]/20 dark:focus:ring-[#00b37a]/20 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500"
                />
                <span className="absolute right-3 inset-y-0 flex items-center text-[10px] bg-white dark:bg-[#252525] border border-slate-100 dark:border-white/10 px-1 rounded h-5 my-auto text-slate-400 dark:text-gray-500 font-mono transition-colors">⌘K</span>
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
                            href="/maintenance?service=Email"
                            active={isActive("/maintenance") && typeof window !== 'undefined' && window.location.search.includes("Email")}
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
                            href="/maintenance?service=Talent%20Pool"
                            active={isActive("/maintenance") && typeof window !== 'undefined' && window.location.search.includes("Talent")}
                        />
                        <SidebarItem
                            icon={<FiUserPlus />}
                            label="Invite Team"
                            href="/maintenance?service=Invite%20Team"
                            active={isActive("/maintenance") && typeof window !== 'undefined' && window.location.search.includes("Invite")}
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
                            href="/maintenance?service=Reports"
                            active={isActive("/maintenance") && typeof window !== 'undefined' && window.location.search.includes("Reports")}
                        />
                    </div>
                </div>
            </div>

            {/* Footer / User Profile Summary */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/5 transition-colors">
                <div className="flex items-center gap-3 px-2">
                    <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-xl"
                    />
                    <div className="flex flex-col text-left">
                        <span className="text-sm font-bold text-slate-800 dark:text-white transition-colors">{user.name}</span>
                        <span className="text-[10px] text-slate-400 dark:text-gray-500 font-medium transition-colors">{user.email}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}

function SidebarItem({ icon, label, href, active }) {
    return (
        <Link
            href={href}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 group outline-none ${active
                ? "bg-[#00845a] text-white shadow-lg shadow-[#00845a]/20"
                : "text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white"
                }`}
        >
            <div className="flex items-center gap-3">
                <span className={`text-lg transition-colors ${active ? "text-white" : "text-slate-400 dark:text-gray-500 group-hover:text-[#00845a] dark:group-hover:text-[#00b37a]"}`}>
                    {icon}
                </span>
                <span className="text-sm font-bold">{label}</span>
            </div>
            {label === "Email" && (
                <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full transition-colors">12</span>
            )}
        </Link>
    );
}
