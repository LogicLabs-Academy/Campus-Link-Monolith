import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./db.js";
import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// basic request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// health
app.get("/api/health", async (req, res) => {
  try {
    const now = await pool.query("SELECT NOW()");
    res.json({ status: "ok", db_time: now.rows[0].now });
  } catch (err) {
    console.error("DB health check error:", err.message);
    res
      .status(500)
      .json({ status: "error", message: "Database not connected" });
  }
});

// mount auth routes under /api/auth
app.use("/api/auth", authRoutes);

app.get("/me", authMiddleware, async (req, res) => {
  try {
    const { id } = req.user; // comes from JWT payload
    const result = await pool.query(
      "SELECT id, email FROM users WHERE id = $1",
      [id]
    );
    if (result.rowCount === 0) return res.sendStatus(404);
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("❌ /me error:", err);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend running on ${PORT}`));
