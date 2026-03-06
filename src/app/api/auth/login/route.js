import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { username, password } = body;

        // Currently configured for single-admin
        if (username === "admin" && password === "admin") {
            const cookieStore = await cookies();
            cookieStore.set("auth_token", "admin_session", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7, // 1 Week
                path: "/",
            });

            return NextResponse.json({ success: true, message: "Login successful" });
        }

        return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
