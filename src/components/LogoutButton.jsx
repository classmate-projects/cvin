"use client";

import { FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/auth/logout", { method: "POST" });
            if (res.ok) {
                toast.success("Logged out successfully");
                router.push("/login");
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-rose-500 transition-colors p-2 text-xl"
            title="Secure Logout"
        >
            <FiLogOut />
        </button>
    );
}
