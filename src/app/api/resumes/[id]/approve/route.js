import { supabase } from "@/lib/supabase";

export async function POST(req, { params }) {
    const { id } = await params;
    const body = await req.json();

    try {
        const { data, error } = await supabase
            .from("resume")
            .update({
                candidate_name: body.candidate_name,
                job_title: body.job_title,
                visa_status: body.visa_status,
                experience_years: parseInt(body.experience_years),
                location: body.location,
                education: body.education,
                specialization: body.specialization,
                status: "Approved", // Flip status to live
                processed_at: new Date().toISOString()
            })
            .eq("resume_id", id)
            .select();

        if (error) throw error;

        return Response.json({ success: true, data: data[0] });
    } catch (err) {
        return Response.json({ success: false, message: err.message }, { status: 500 });
    }
}
