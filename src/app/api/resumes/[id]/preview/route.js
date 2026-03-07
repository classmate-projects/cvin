import { supabase } from "@/lib/supabase";

export async function GET(req, { params }) {
  const { id } = await params;

  try {
    const { data: rows, error } = await supabase
      .from("resume")
      .select("file_name, file_type, storage_path")
      .eq("resume_id", id);

    if (error) throw error;
    if (!rows || rows.length === 0) {
      return new Response("Not found", { status: 404 });
    }

    const resume = rows[0];

    // Download from Supabase Storage
    const { data: fileBlob, error: downloadError } = await supabase.storage
      .from("resumes")
      .download(resume.storage_path);

    if (downloadError) throw downloadError;

    // Safety check for file type
    let contentType = "application/octet-stream";
    if (resume.file_type === "pdf") {
      contentType = "application/pdf";
    } else if (resume.file_type === "docx") {
      contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    const fileBuffer = Buffer.from(await fileBlob.arrayBuffer());

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline",
      },
    });
  } catch (err) {
    console.error("Preview error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), { status: 500 });
  }
}
