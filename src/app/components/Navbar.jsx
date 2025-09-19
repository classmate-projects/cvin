import { FileIcon } from "@/lib/icons"

export default function Navbar () {
    return (
        <>
            <header className=" flex px-6 py-4">
                <div className=" flex items-center gap-4">
                    <FileIcon className=" text-blue-500 text-2xl" />
                    <h1 className=" text-xl font-semibold">Resume Manager</h1>
                </div>
            </header>
        </>
    )
}