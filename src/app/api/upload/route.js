import { supabase } from "@/lib/supabase";
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

    // 1. Upload file to Supabase Storage
    const storagePath = `${Date.now()}_${fileName.replace(/\s+/g, '_')}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) throw uploadError;

    // 2. Insert metadata into DB with storage path
    const { data: dbResult, error: dbError } = await supabase.from("resume").insert([{
      candidate_name: candidateName,
      file_name: fileName,
      file_type: fileType,
      storage_path: storagePath,
      age: metadata.age,
      job_title: metadata.job_title,
      visa_status: metadata.visa_status,
      experience_years: metadata.experience_years ? parseInt(metadata.experience_years) : null,
      specialization: metadata.specialization,
      email: metadata.email,
      location: metadata.location,
      education: metadata.education,
      role: metadata.role
    }]).select("resume_id").single();

    if (dbError) {
      // Cleanup storage if DB insert fails
      await supabase.storage.from("resumes").remove([storagePath]);
      throw dbError;
    }

    return NextResponse.json({ success: true, id: dbResult.resume_id });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
