import pool from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const [rows] = await pool.query(
      `SELECT resume_id, candidate_name, file_type, created_at
       FROM resume
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [limit + 1, offset]
    );

    const hasMore = rows.length > limit;
    const resumes = hasMore ? rows.slice(0, limit) : rows;

    return Response.json({ resumes, hasMore });
  } catch (err) {
    console.error("❌ SQL error:", err); // full error in server logs
    return new Response(
      JSON.stringify({
        error: "DB error",
        details: err.message,   // send MySQL error message back
        code: err.code,         // MySQL error code
      }),
      { status: 500 }
    );
  }
}
