import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testDB() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Database connected:", result.rows[0]);
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  } finally {
    await pool.end();
  }
}

testDB();
