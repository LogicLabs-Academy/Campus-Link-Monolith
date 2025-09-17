// src/components/CampusLogo.jsx
export default function CampusLogo({ size = 40 }) {
  return (
    <img
      src="/icons/icon-192x192.png"
      alt="CampusLink Logo"
      width={size}
      height={size}
      className="object-contain"
    />
  );
}
