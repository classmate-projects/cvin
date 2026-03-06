import pool from "@/lib/db";

// DELETE resume
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await pool.query("DELETE FROM resume WHERE resume_id = ?", [id]);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("DB error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
