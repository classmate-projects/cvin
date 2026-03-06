import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
    try {
        const [rows] = await pool.query("SELECT category, label, value, placeholder FROM app_config ORDER BY label ASC");

        // Group by category for easier frontend consumption
        const config = rows.reduce((acc, current) => {
            if (!acc[current.category]) {
                acc[current.category] = [];
            }
            acc[current.category].push(current);
            return acc;
        }, {});

        return NextResponse.json({ success: true, config });
    } catch (error) {
        console.error("Config fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch configuration" }, { status: 500 });
    }
}
