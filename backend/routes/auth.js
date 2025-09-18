import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js"; // ✅ added import

const router = express.Router();

// helper to create JWT
const makeAccessToken = (user) => {
  console.log("🔑 Generating JWT for:", user);
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
};

// --------- REGISTER ----------
router.post("/register", async (req, res) => {
  console.log("➡️  POST /api/auth/register called");
  console.log("   request body:", req.body);

  const { email, password } = req.body;
  if (!email || !password) {
    console.log("   ❌ missing email or password");
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    console.log("   🔍 Checking if user exists:", email);
    const check = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    console.log("   check.rowCount:", check.rowCount);

    if (check.rowCount > 0) {
      console.log("   ❌ email already exists");
      return res.status(400).json({ error: "Email already exists" });
    }

    console.log("   🔑 Hashing password...");
    const hashed = await bcrypt.hash(password, 10);

    console.log("   📝 Inserting new user into DB...");
    const insert = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashed]
    );
    console.log("   ✅ inserted user:", insert.rows[0]);

    const token = makeAccessToken(insert.rows[0]);
    console.log("   ✅ token created, sending response");

    return res.status(201).json({ token, user: insert.rows[0] });
  } catch (err) {
    console.error("   ❌ REGISTER ERROR:", err.message || err);
    return res.status(500).json({ error: "Registration failed" });
  }
});

// --------- LOGIN ----------
router.post("/login", async (req, res) => {
  console.log("➡️  POST /api/auth/login called");
  console.log("   request body:", req.body);

  const { email, password } = req.body;
  if (!email || !password) {
    console.log("   ❌ missing email or password");
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    console.log("   🔍 Looking up user:", email);
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    console.log("   query result rowCount:", result.rowCount);

    if (result.rowCount === 0) {
      console.log("   ❌ no user found for email");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    console.log("   ✅ user found:", user);

    console.log("   🔑 Comparing password...");
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      console.log("   ❌ password mismatch");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("   ✅ password correct, generating token...");
    const token = makeAccessToken(user);

    console.log("   ✅ login success, sending response");
    return res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("   ❌ LOGIN ERROR:", err?.message || err);
    return res.status(500).json({ error: "Login failed" });
  }
});

// --------- ME ----------
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const { id } = req.user;
    const result = await pool.query(
      "SELECT id, email FROM users WHERE id = $1",
      [id]
    );
    if (result.rowCount === 0) return res.sendStatus(404);
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("❌ /me error:", err.message);
    res.sendStatus(500);
  }
});

export default router;
