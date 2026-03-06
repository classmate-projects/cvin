"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="p-2 text-transparent w-9 h-9"></div>; // Placeholder
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-slate-400 hover:text-slate-800 dark:text-slate-500 dark:hover:text-white transition-colors p-2 text-xl"
            aria-label="Toggle Theme"
        >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>
    );
}
