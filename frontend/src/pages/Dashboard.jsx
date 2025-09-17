import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return navigate("/login");

      try {
        const res = await axios.get("http://localhost:4000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          localStorage.removeItem("accessToken");
          navigate("/login");
        } else {
          console.error("❌ Dashboard fetch error:", err);
        }
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl bg-black font-bold text-forest">
        Welcome {user?.email || "Loading..."} 🎉
      </h1>
    </div>
  );
}
