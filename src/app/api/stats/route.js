import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
    try {
        // Total resumes
        const [totalRows] = await pool.query("SELECT COUNT(*) as count FROM resume");
        const total = totalRows[0].count;

        // Recently added (last 7 days)
        const [recentRows] = await pool.query("SELECT COUNT(*) as count FROM resume WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
        const recent = recentRows[0].count;

        // Top categories
        const [categoryRows] = await pool.query("SELECT job_title, COUNT(*) as count FROM resume WHERE job_title IS NOT NULL GROUP BY job_title ORDER BY count DESC LIMIT 3");

        // Formats Breakdown
        const [formatRows] = await pool.query("SELECT file_type, COUNT(*) as count FROM resume GROUP BY file_type");

        return NextResponse.json({
            success: true,
            stats: {
                total,
                recent,
                categories: categoryRows,
                formats: formatRows
            }
        });
    } catch (error) {
        console.error("Stats fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
