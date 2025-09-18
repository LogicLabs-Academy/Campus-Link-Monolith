import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api"; // ✅ axios instance, not string
import logo from "/icons/icon-192x192.png";
import bg from "/icons/icon-512x512.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("➡️ Sending login request:", { email, password });

      const res = await api.post("/auth/login", { email, password });

      console.log("✅ Login success:", res.data);

      if (res.data.token) {
        localStorage.setItem("accessToken", res.data.token);
      }
      if (res.data.refreshToken) {
        localStorage.setItem("refreshToken", res.data.refreshToken);
      }

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("❌ LOGIN ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 relative"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "200px",
        opacity: 0.95,
      }}
    >
      {/* Logo top-left */}
      <div className="absolute top-5 left-5 flex items-center space-x-2">
        <img src={logo} alt="CampusLink" className="w-16 h-16" />
        <span className="text-3xl font-logo text-forest">CampusLink</span>
      </div>

      {/* Login Card */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-forest">
          Login
        </h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
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
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <Link to="/register" className="text-water hover:underline text-sm">
              Create account
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-forest text-white py-3 rounded-lg hover:bg-lemon transition"
          >
            Sign In
          </button>
        </form>

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
