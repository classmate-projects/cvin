import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { email } = await req.json();

        // Check if user exists
        const { data: rows, error } = await supabase
            .from("users")
            .select("id")
            .eq("email", email);

        if (error) throw error;

        if (!rows || rows.length === 0) {
            // For security, don't reveal if email exists, but user requested specific error toasts so we will reveal it
            return NextResponse.json({ success: false, message: "Identity mismatch. Account not found." }, { status: 404 });
        }

        // Simulating email send
        // In real world, generate token and send email via SMTP logic here

        return NextResponse.json({ success: true, message: "Reset link dispatched." });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
