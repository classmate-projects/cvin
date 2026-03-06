import { FileIcon, DashboardIcon, SearchIcon, FileAddIcon } from "@/lib/icons"
import Link from "next/link"

export default function Navbar() {
    return (
        <header className="flex justify-between items-center px-10 py-5 bg-[#0f0f0f]/80 backdrop-blur-3xl sticky top-0 z-50 border-b border-white/5">
            <div className="flex items-center gap-4 group">
                <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                    <FileIcon className="text-white text-xl" />
                </div>
                <Link href="/" className="text-2xl font-black bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent tracking-tighter">CVin</Link>
            </div>

            <nav className="hidden md:flex items-center justify-center gap-12 bg-white/5 px-10 py-3 rounded-full border border-white/5">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-cyan-400 transition-all uppercase tracking-widest"
                >
                    <DashboardIcon /> Dashboard
                </Link>
                <Link
                    href="/upload"
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-cyan-400 transition-all uppercase tracking-widest"
                >
                    <FileAddIcon /> Upload
                </Link>
                <Link
                    href="/find-resume"
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-cyan-400 transition-all uppercase tracking-widest"
                >
                    <SearchIcon /> Discovery
                </Link>
            </nav>

            <div className="hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-800 border border-white/10 shadow-inner"></div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Administrator</div>
            </div>
        </header>
    )
}