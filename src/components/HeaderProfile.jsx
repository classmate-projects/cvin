"use client";

import { useState, useEffect } from "react";

export default function HeaderProfile() {
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

    return (
        <div className="flex items-center gap-3 group cursor-pointer">
            <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-bold text-slate-800 dark:text-white transition-colors">{user.name}</span>
                <span className="text-[10px] text-slate-400 dark:text-gray-500 font-medium transition-colors">{user.email}</span>
            </div>
            <img
                src={user.avatar}
                alt="User Avatar"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl group-hover:opacity-90 transition-opacity"
            />
        </div>
    );
}
