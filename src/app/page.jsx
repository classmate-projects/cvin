import UploadedResume from "../components/UploadedResume";
import UploadResume from "../components/UploadResume";

export default function Home () {
    return (
        <div className="flex flex-col gap-8 px-8 sm:px-20 py-10">
            <UploadResume />
            <UploadedResume />
        </div>
    )
}