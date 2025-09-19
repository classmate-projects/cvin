import { CloudUploadIcon, FileAddIcon } from "@/lib/icons"

export default function UploadResume() {
    return (
        <div>
            <div className=" flex justify-between items-center">
                <h2 className=" text-2xl font-bold">Manage Resumes</h2>
                <button className=" flex items-center gap-2 bg-cyan-800 px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-700 transition-colors duration-150 ease-in-out"> <FileAddIcon /> Upload Resume</button>
            </div>
            <div className="mt-8 flex justify-center items-center flex-col gap-1 border-3 border-dashed border-white/20 w-full bg-[#191919] py-15 rounded-md">
                <CloudUploadIcon className="text-white/60 text-5xl mb-6"/>
                <p className=" font-bold">Drag and drop your resume or click to upload</p>
                <p className=" text-sm opacity-80">Supported formats: PDF, DOCX</p>
                <button className=" bg-gray-500/50 cursor-pointer mt-6 px-4 py-2 rounded-md text-cyan-600 font-bold">Browse Files</button>
            </div>
        </div>
    )
}