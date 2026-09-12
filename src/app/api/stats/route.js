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
            .slice(0, 8);

        // Formats Breakdown
        const { data: allFileTypes, error: formatError } = await supabase
            .from("resume")
            .select("file_type");

        if (formatError) throw formatError;

        const formatCounts = allFileTypes.reduce((acc, curr) => {
            const key = curr.file_type || "Unknown";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        const formatsResult = Object.keys(formatCounts).map(type => ({
            file_type: type,
            count: formatCounts[type]
        }));

        // Status pipeline breakdown (Approved / Pending / etc.)
        const { data: allStatuses, error: statusError } = await supabase
            .from("resume")
            .select("status");

        if (statusError) throw statusError;

        const statusCounts = allStatuses.reduce((acc, curr) => {
            const key = curr.status || "Pending";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        // Source breakdown (Email intake vs. Manual upload)
        const { data: allSources, error: sourceError } = await supabase
            .from("resume")
            .select("source");

        if (sourceError) throw sourceError;

        const sourceCounts = allSources.reduce((acc, curr) => {
            const key = curr.source || "Manual Upload";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        // 7-day intake trend
        const { data: recentRows, error: trendError } = await supabase
            .from("resume")
            .select("created_at")
            .gte("created_at", sevenDaysAgo.toISOString());

        if (trendError) throw trendError;

        const trendBuckets = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            trendBuckets[key] = 0;
        }
        recentRows.forEach(row => {
            const key = new Date(row.created_at).toISOString().slice(0, 10);
            if (key in trendBuckets) trendBuckets[key] += 1;
        });
        const weeklyTrend = Object.keys(trendBuckets).map(date => ({
            date,
            label: new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" }),
            count: trendBuckets[date]
        }));

        return NextResponse.json({
            success: true,
            stats: {
                total: total || 0,
                recent: recent || 0,
                categories: sortedCategories,
                formats: formatsResult,
                statusCounts,
                sourceCounts,
                weeklyTrend
            }
        });
    } catch (error) {
        console.error("Stats fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
