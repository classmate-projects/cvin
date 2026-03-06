import pool from "@/lib/db";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const [rows] = await pool.query(
      "SELECT file_name, file_type, resume_file FROM resume WHERE resume_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return new Response("Not found", { status: 404 });
    }

    const resume = rows[0];

    // Safety check for file type
    let contentType = "application/octet-stream";
    if (resume.file_type === "pdf") {
      contentType = "application/pdf";
    } else if (resume.file_type === "docx") {
      contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    return new Response(resume.resume_file, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline",
      },
    });
  } catch (err) {
    console.error("DB error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
