import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
    try {
        const body = await req.json();
        const { username, password } = body;

        // Query the database for the user
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [username]);
        const user = rows[0];

        if (user && user.password === password) {
            const cookieStore = await cookies();

            // Encode basic session payload since we don't have JWT here
            const sessionData = Buffer.from(JSON.stringify({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            })).toString("base64");

            cookieStore.set("auth_token", sessionData, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7, // 1 Week
                path: "/",
            });

            return NextResponse.json({ success: true, message: "Login successful" });
        }

        return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
