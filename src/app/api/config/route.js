import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
        const { data: rows, error } = await supabase
            .from("app_config")
            .select("category, label, value, placeholder")
            .order("label", { ascending: true });

        if (error) throw error;

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
