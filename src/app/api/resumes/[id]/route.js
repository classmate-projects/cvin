import { supabase } from "@/lib/supabase";
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
    // 1. Get storage path first
    const { data: resume, error: fetchError } = await supabase
      .from("resume")
      .select("storage_path")
      .eq("resume_id", id)
      .single();

    if (fetchError) throw fetchError;

    // 2. Delete from Storage
    if (resume?.storage_path) {
      await supabase.storage.from("resumes").remove([resume.storage_path]);
    }

    // 3. Delete from DB
    const { error: dbError } = await supabase.from("resume").delete().eq("resume_id", id);
    if (dbError) throw dbError;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Delete error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), { status: 500 });
  }
}
