import { supabase } from "@/lib/supabase";
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
        const { data: rows, error } = await supabase
            .from("users")
            .select("id, name, email, role, created_at")
            .order("id", { ascending: false });

        if (error) throw error;
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

        const { data: existing, error: checkError } = await supabase
            .from("users")
            .select("id")
            .eq("email", email);

        if (checkError) throw checkError;

        if (existing && existing.length > 0) {
            return NextResponse.json({ success: false, message: "Email already in use" }, { status: 400 });
        }

        const { error: insertError } = await supabase
            .from("users")
            .insert([{ name, email, password, role }]);

        if (insertError) throw insertError;

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

        const { error } = await supabase
            .from("users")
            .delete()
            .eq("id", id);

        if (error) throw error;

        return NextResponse.json({ success: true, message: "User deleted" });
    } catch (err) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
