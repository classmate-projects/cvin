import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function getAdminStatus() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;
    if (!authToken) return false;
    if (authToken === "admin_session") return true;

    try {
        const decoded = Buffer.from(authToken, "base64").toString("utf8");
        const user = JSON.parse(decoded);
        return user.role === "Admin";
    } catch {
        return false;
    }
}

export async function GET() {
    const isAdmin = await getAdminStatus();
    if (!isAdmin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });

    try {
        const [rows] = await pool.query("SELECT id, name, email, role, created_at FROM users ORDER BY id DESC");
        return NextResponse.json({ success: true, users: rows });
    } catch (err) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

export async function POST(req) {
    const isAdmin = await getAdminStatus();
    if (!isAdmin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });

    try {
        const { name, email, password, role } = await req.json();

        const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
        if (existing.length > 0) {
            return NextResponse.json({ success: false, message: "Email already in use" }, { status: 400 });
        }

        await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            [name, email, password, role]
        );
        return NextResponse.json({ success: true, message: "User added" });
    } catch (err) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req) {
    const isAdmin = await getAdminStatus();
    if (!isAdmin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ success: false, message: "ID missing" }, { status: 400 });

        await pool.query("DELETE FROM users WHERE id = ?", [id]);
        return NextResponse.json({ success: true, message: "User deleted" });
    } catch (err) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
