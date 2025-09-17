import dotenv from "dotenv";
import pkg from "pg";
dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("DB connection failed:", err.message);
  } else {
    console.log("Connected! Time:", res.rows[0]);
  }
  pool.end();
});
