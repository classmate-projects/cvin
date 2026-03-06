import mysql from "mysql2/promise";

async function checkSchema() {
    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'P6@b!n@123',
            database: 'resume_store'
        });

        const [rows] = await conn.execute("DESCRIBE resume");
        console.log(JSON.stringify(rows, null, 2));
        await conn.end();
        process.exit(0);
    } catch (err) {
        console.error("Error describing table:", err.message);
        process.exit(1);
    }
}

checkSchema();
