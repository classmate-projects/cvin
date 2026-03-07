import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
        // Total resumes
        const { count: total, error: totalError } = await supabase
            .from("resume")
            .select("*", { count: "exact", head: true });

        if (totalError) throw totalError;

        // Recently added (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { count: recent, error: recentError } = await supabase
            .from("resume")
            .select("*", { count: "exact", head: true })
            .gte("created_at", sevenDaysAgo.toISOString());

        if (recentError) throw recentError;

        // Top categories (Aggregation in JS for simplicity, or use RPC)
        const { data: allJobTitles, error: categoryError } = await supabase
            .from("resume")
            .select("job_title")
            .not("job_title", "is", null);

        if (categoryError) throw categoryError;

        const categoryCounts = allJobTitles.reduce((acc, curr) => {
            acc[curr.job_title] = (acc[curr.job_title] || 0) + 1;
            return acc;
        }, {});

        const sortedCategories = Object.keys(categoryCounts)
            .map(title => ({ job_title: title, count: categoryCounts[title] }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        // Formats Breakdown
        const { data: allFileTypes, error: formatError } = await supabase
            .from("resume")
            .select("file_type");

        if (formatError) throw formatError;

        const formatCounts = allFileTypes.reduce((acc, curr) => {
            acc[curr.file_type] = (acc[curr.file_type] || 0) + 1;
            return acc;
        }, {});

        const formatsResult = Object.keys(formatCounts).map(type => ({
            file_type: type,
            count: formatCounts[type]
        }));

        return NextResponse.json({
            success: true,
            stats: {
                total: total || 0,
                recent: recent || 0,
                categories: sortedCategories,
                formats: formatsResult
            }
        });
    } catch (error) {
        console.error("Stats fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
