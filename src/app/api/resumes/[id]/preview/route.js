import mysql from "mysql2/promise";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await conn.execute(
      "SELECT file_name, file_type, resume_file FROM resume WHERE resume_id = ?",
      [id]
    );
    await conn.end();

    if (rows.length === 0) {
      return new Response("Not found", { status: 404 });
    }

    const resume = rows[0];
    return new Response(resume.resume_file, {
      headers: {
        "Content-Type":
          resume.file_type === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "inline", // shows inside browser
      },
    });
  } catch (err) {
    console.error("DB error:", err);
    return new Response(JSON.stringify({ error: "DB error" }), { status: 500 });
  }
}
