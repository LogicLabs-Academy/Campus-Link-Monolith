import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SplashLogo() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900 overflow-hidden">
      <img
        src="/icons/icon-512x512.png"
        alt="CampusLink Logo"
        className="animate-pulse w-90 h-90"
      />
    </div>
  );
}
