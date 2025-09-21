import { FileIcon } from "@/lib/icons"
import Link from "next/link"

export default function Navbar () {
    return (
        <>
            <header className=" flex justify-between items-center px-6 py-4 bg-gray-400/8 backdrop-blur-2xl">
                <div className=" flex items-center gap-4">
                    <FileIcon className=" text-blue-500 text-2xl" />
                    <Link href="/" className=" text-xl font-semibold bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">Resume Manager</Link>
                </div>
                <nav className=" flex items-center justify-center gap-8 px-8">
                    <Link href="/" className=" text-white/70 hover:text-white transition-color duration-150 ease-in-out">Dashboard</Link>
                    <Link href="/find-resume" className=" text-white/70 hover:text-white transition-color duration-150 ease-in-out">Find Resume</Link>
                </nav>
            </header>
        </>
    )
}