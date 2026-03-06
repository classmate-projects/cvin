const mysql = require("mysql2/promise");

async function run() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "P6@b!n@123",
        database: process.env.DB_NAME || "resume_store",
    });

    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'Viewer',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Check if admin exists
        const [rows] = await pool.query("SELECT * FROM users WHERE email = 'admin'");
        if (rows.length === 0) {
            await pool.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [
                "System Administrator",
                "admin",
                "admin", // In production this should be hashed
                "Admin"
            ]);
            console.log("Admin user created.");
        } else {
            console.log("Admin user already exists.");
        }

        console.log("Users table initialized successfully.");
    } catch (err) {
        console.error("DB Init Error:", err);
    } finally {
        pool.end();
    }
}

run();
