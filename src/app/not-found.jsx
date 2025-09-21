"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center h-[90dvh] px-4">
      <h1 className="text-8xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">404</h1>
      <p className="mt-4 text-3xl text-gray-400">Page not found</p>
      <p className="mt-2 text-gray-400 text-center max-w-md">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>
      <div className=" flex gap-4 items-center">
      <Link
        href="/"
        className="mt-6 inline-block px-6 py-3 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition cursor-pointer"
      >
        Go Back Home
      </Link>
    <button
    onClick={() => router.back()}
     className="mt-6 inline-block px-6 py-3 rounded-lg bg-gray-600 text-white font-medium shadow hover:bg-gray-700 transition cursor-pointer">Go Back</button>
      </div>
    </div>
  );
}
