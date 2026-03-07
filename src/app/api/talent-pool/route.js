import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Fetch resumes ordered by experience generally
        const { data: rows, error } = await supabase
            .from("resume")
            .select("resume_id, candidate_name, file_type, created_at, job_title, visa_status, experience_years, specialization, location")
            .order("job_title", { ascending: true })
            .order("experience_years", { ascending: false })
            .order("created_at", { ascending: false });

        if (error) throw error;

        // Group by job title and keep only top 10
        const grouped = {};

        rows.forEach(row => {
            const title = row.job_title || "Other/Unspecified";
            if (!grouped[title]) {
                grouped[title] = [];
            }
            if (grouped[title].length < 10) {
                grouped[title].push(row);
            }
        });

        // Convert dict to array of groups for the UI
        const result = Object.keys(grouped).map(title => ({
            designation: title,
            candidates: grouped[title]
        }));

        // Sort designations alphabetically
        result.sort((a, b) => a.designation.localeCompare(b.designation));

        return NextResponse.json({ success: true, groups: result });
    } catch (err) {
        console.error("Talent pool error:", err);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
