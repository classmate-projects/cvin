import mysql from "mysql2/promise";

async function migrate() {
    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'P6@b!n@123',
            database: 'resume_store'
        });

        console.log("Adding metadata columns to 'resume' table...");

        const alterQuery = `
      ALTER TABLE resume 
      ADD COLUMN age VARCHAR(10) NULL,
      ADD COLUMN job_title VARCHAR(255) NULL,
      ADD COLUMN visa_status VARCHAR(100) NULL,
      ADD COLUMN experience_years INT NULL,
      ADD COLUMN specialization VARCHAR(255) NULL,
      ADD COLUMN email VARCHAR(255) NULL,
      ADD COLUMN location VARCHAR(255) NULL,
      ADD COLUMN education TEXT NULL,
      ADD COLUMN role VARCHAR(100) NULL;
    `;

        await conn.execute(alterQuery);
        console.log("Migration successful!");

        await conn.end();
        process.exit(0);
    } catch (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
            console.log("Columns already exist. Skipping migration.");
            process.exit(0);
        }
        console.error("Migration error:", err.message);
        process.exit(1);
    }
}

migrate();
