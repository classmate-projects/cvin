import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const candidateName = formData.get("candidate_name");
    const file = formData.get("resume_file");

    if (!candidateName || !file) {
      return NextResponse.json(
        { success: false, message: "Missing data" },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;

    // Normalize file type
    let fileType = "unknown";
    if (file.type === "application/pdf") {
      fileType = "pdf";
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      fileType = "docx";
    }

    // Insert into DB
    const [result] = await pool.query(
      "INSERT INTO resume (candidate_name, file_name, file_type, resume_file) VALUES (?, ?, ?, ?)",
      [candidateName, fileName, fileType, buffer]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}
