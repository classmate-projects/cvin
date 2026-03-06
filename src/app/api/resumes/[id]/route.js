import pool from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// DELETE resume
export async function DELETE(req, props) {
  const params = await props.params;
  const { id } = params;

  // Authorization Check
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  if (!authToken) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  let role = "Viewer";
  if (authToken === "admin_session") {
    role = "Admin";
  } else {
    try {
      const decoded = Buffer.from(authToken, "base64").toString("utf8");
      role = JSON.parse(decoded).role;
    } catch (err) { }
  }

  if (role === "Viewer") {
    return NextResponse.json({ success: false, message: "Viewers cannot erase intelligence items." }, { status: 403 });
  }

  try {
    await pool.query("DELETE FROM resume WHERE resume_id = ?", [id]);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("DB error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
