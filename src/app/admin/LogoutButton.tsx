"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleClick = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleClick}
      className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
    >
      Sign out
    </button>
  );
}
