import pool from "@/lib/db";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req) {
  try {
    const formData = await req.formData();
    const candidateName = formData.get("candidate_name");
    const file = formData.get("resume_file");

    // Metadata fields
    const metadata = {
      age: formData.get("age"),
      job_title: formData.get("job_title"),
      visa_status: formData.get("visa_status"),
      experience_years: formData.get("experience_years"),
      specialization: formData.get("specialization"),
      email: formData.get("email"),
      location: formData.get("location"),
      education: formData.get("education"),
      role: formData.get("role"),
    };

    if (!candidateName || !file) {
      return NextResponse.json(
        { success: false, message: "Missing data" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

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
    } else {
      return NextResponse.json(
        { success: false, message: "Unsupported file type" },
        { status: 400 }
      );
    }

    // Insert into DB
    const [result] = await pool.query(
      `INSERT INTO resume (
        candidate_name, file_name, file_type, resume_file, 
        age, job_title, visa_status, experience_years, 
        specialization, email, location, education, role
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        candidateName, fileName, fileType, buffer,
        metadata.age, metadata.job_title, metadata.visa_status, metadata.experience_years,
        metadata.specialization, metadata.email, metadata.location, metadata.education, metadata.role
      ]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
