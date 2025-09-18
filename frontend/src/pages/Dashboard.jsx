import { useEffect, useState } from "react";
import api from "../../api";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        console.error(
          "❌ Dashboard fetch error:",
          err.response?.data || err.message
        );
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      {user ? (
        <h1 className="text-2xl text-forest">🎓 Welcome back, {user.email}</h1>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
