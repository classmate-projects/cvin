import { supabase } from "@/lib/supabase";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  // Filters
  const search = searchParams.get("search");
  const jobTitle = searchParams.get("job_title");
  const visaStatus = searchParams.get("visa_status");
  const specialization = searchParams.get("specialization");
  const location = searchParams.get("location");
  const experienceMin = searchParams.get("experience_min");
  const experienceMax = searchParams.get("experience_max");
  const sortBy = searchParams.get("sort") || "created_at";

  try {
    let query = supabase
      .from("resume")
      .select("resume_id, candidate_name, file_type, created_at, job_title, visa_status, experience_years, specialization, location");

    if (search) {
      query = query.ilike("candidate_name", `%${search}%`);
    }
    if (jobTitle) {
      query = query.ilike("job_title", `%${jobTitle}%`);
    }
    if (visaStatus) {
      query = query.eq("visa_status", visaStatus);
    }
    if (specialization) {
      query = query.ilike("specialization", `%${specialization}%`);
    }
    if (location) {
      query = query.ilike("location", `%${location}%`);
    }
    if (experienceMin) {
      query = query.gte("experience_years", parseInt(experienceMin));
    }
    if (experienceMax) {
      query = query.lte("experience_years", parseInt(experienceMax));
    }

    // Sorting
    const allowedSort = ["created_at", "candidate_name", "job_title"];
    const activeSort = allowedSort.includes(sortBy) ? sortBy : "created_at";
    query = query.order(activeSort, { ascending: false });

    // Pagination
    query = query.range(offset, offset + limit);

    const { data: rows, error } = await query;

    if (error) throw error;

    const hasMore = rows.length > limit;
    const resumes = hasMore ? rows.slice(0, limit) : rows;

    return Response.json({ success: true, resumes, hasMore });
  } catch (err) {
    console.error("❌ Supabase error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      { status: 500 }
    );
  }
}
