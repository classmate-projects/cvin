import pool from "@/lib/db";
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
        const [rows] = await pool.query("SELECT password FROM users WHERE id = ?", [userId]);

        if (rows.length === 0 || rows[0].password !== currentPassword) {
            return NextResponse.json({ success: false, message: "Invalid current priority key." }, { status: 400 });
        }

        // Update to new password
        await pool.query("UPDATE users SET password = ? WHERE id = ?", [newPassword, userId]);

        return NextResponse.json({ success: true, message: "Key rotated." });
    } catch (error) {
        console.error("Change Password Error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
