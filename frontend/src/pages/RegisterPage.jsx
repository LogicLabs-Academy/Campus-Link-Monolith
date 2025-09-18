import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api"; // ✅ use axios instance we made

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      console.log("➡️ Sending register request:", { email, password });
      const res = await api.post("/auth/register", { email, password }); // ✅ use api instance

      console.log("✅ Register success:", res.data);

      if (res.data.token) {
        localStorage.setItem("accessToken", res.data.token);
      }
      if (res.data.refreshToken) {
        localStorage.setItem("refreshToken", res.data.refreshToken);
      }

      navigate("/login");
    } catch (err) {
      console.error("❌ REGISTER ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 relative"
      style={{
        backgroundImage: `url("/icons/icon-512x512.png")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "200px",
        opacity: 0.95,
      }}
    >
      {/* Logo top-left */}
      <div className="absolute top-5 left-5 flex items-center space-x-2">
        <img
          src="/icons/icon-192x192.png"
          alt="CampusLink"
          className="w-16 h-16"
        />
        <span className="text-3xl font-logo text-forest">CampusLink</span>
      </div>

      {/* Register Card */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-forest">
          Create Account
        </h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lemon"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lemon"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lemon"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-forest text-white py-3 rounded-lg hover:bg-lemon transition"
          >
            Sign Up
          </button>
        </form>
        <p className="mx-2 text-gray-800 mt-4">
          Have an account already?
          <Link to="/login" className="text-water ml-2 hover:underline">
            Login
          </Link>
        </p>

        {/* Footer links */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <Link to="/faq" className="mx-2 hover:underline">
            FAQ
          </Link>
          |
          <Link to="/terms" className="mx-2 hover:underline">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </div>
  );
}
