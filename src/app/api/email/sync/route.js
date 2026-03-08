import { supabase } from "@/lib/supabase";

export async function POST(req) {
    try {
        // MOCK EMAIL SYNC LOGIC
        // In production, this would connect to IMAP/Exchange and download attachments

        const mockEmailCV = {
            candidate_name: "John Doe (Email Sync)",
            file_name: "john_doe_cv.pdf",
            file_type: "application/pdf",
            storage_path: "resumes/mock_email_cv.pdf",
            status: "Pending",
            source: "Email",
            sender_email: "hr.portal@talent-agency.com",
            job_title: "Senior Full Stack Engineer",
            experience_years: 8,
            education: "Master of Science in Computer Science",
            specialization: "React, Node.js, AWS Cloud"
        };

        const { data, error } = await supabase
            .from("resume")
            .insert([mockEmailCV])
            .select();

        if (error) throw error;

        return Response.json({
            success: true,
            message: "Successfully synced 1 new CV from candidate email.",
            data: data[0]
        });

    } catch (err) {
        console.error("Sync Error:", err);
        return Response.json({ success: false, message: err.message }, { status: 500 });
    }
}
