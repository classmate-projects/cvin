import mysql from "mysql2/promise";

// DELETE resume
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await conn.execute("DELETE FROM resume WHERE resume_id = ?", [id]);
    await conn.end();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("DB error:", err);
    return new Response(JSON.stringify({ error: "DB error" }), { status: 500 });
  }
}
