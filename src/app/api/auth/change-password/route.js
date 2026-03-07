import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        const cookieStore = await cookies();
        const authToken = cookieStore.get("auth_token")?.value;
        if (!authToken) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        let userId = null;
        if (authToken === "admin_session") {
            userId = 1; // Assuming admin had ID 1 in our seed
        } else {
            const decoded = Buffer.from(authToken, "base64").toString("utf8");
            userId = JSON.parse(decoded).id;
        }

        const { currentPassword, newPassword } = await req.json();

        // Validate user password
        const { data: rows, error: fetchError } = await supabase
            .from("users")
            .select("password")
            .eq("id", userId);

        if (fetchError) throw fetchError;

        if (!rows || rows.length === 0 || rows[0].password !== currentPassword) {
            return NextResponse.json({ success: false, message: "Invalid current priority key." }, { status: 400 });
        }

        // Update to new password
        const { error: updateError } = await supabase
            .from("users")
            .update({ password: newPassword })
            .eq("id", userId);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true, message: "Key rotated." });
    } catch (error) {
        console.error("Change Password Error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
