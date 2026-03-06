import pool from "@/lib/db";

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
    let query = `
      SELECT resume_id, candidate_name, file_type, created_at, 
             job_title, visa_status, experience_years, specialization, location
      FROM resume 
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND candidate_name LIKE ?`;
      params.push(`%${search}%`);
    }
    if (jobTitle) {
      query += ` AND job_title LIKE ?`;
      params.push(`%${jobTitle}%`);
    }
    if (visaStatus) {
      query += ` AND visa_status = ?`;
      params.push(visaStatus);
    }
    if (specialization) {
      query += ` AND specialization LIKE ?`;
      params.push(`%${specialization}%`);
    }
    if (location) {
      query += ` AND location LIKE ?`;
      params.push(`%${location}%`);
    }
    if (experienceMin) {
      query += ` AND experience_years >= ?`;
      params.push(parseInt(experienceMin));
    }
    if (experienceMax) {
      query += ` AND experience_years <= ?`;
      params.push(parseInt(experienceMax));
    }

    // Sorting
    const allowedSort = ["created_at", "candidate_name", "job_title"];
    const activeSort = allowedSort.includes(sortBy) ? sortBy : "created_at";
    query += ` ORDER BY ${activeSort} DESC`;

    // Pagination
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit + 1, offset);

    const [rows] = await pool.query(query, params);

    const hasMore = rows.length > limit;
    const resumes = hasMore ? rows.slice(0, limit) : rows;

    return Response.json({ success: true, resumes, hasMore });
  } catch (err) {
    console.error("❌ SQL error:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
