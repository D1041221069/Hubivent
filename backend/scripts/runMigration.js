import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

async function runMigration() {
  try {
    const sqlPath = path.join("migrations", "initial.sql");
    const sql = fs.readFileSync(sqlPath, "utf-8");

    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

    await conn.query(sql);
    await conn.end();

    console.log("✔ Migration executed successfully");
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

runMigration();
