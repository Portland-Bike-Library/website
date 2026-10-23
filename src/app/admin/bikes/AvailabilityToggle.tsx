"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AvailabilityToggle({
  id,
  available,
}: {
  id: string;
  available: boolean;
}) {
  const router = useRouter();
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  const toggle = async () => {
    setError("");
    setWorking(true);
    try {
      const res = await fetch(`/api/admin/bikes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !available }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed.");
      }
    } catch {
      setError("Network error.");
    }
    setWorking(false);
  };

  return (
    <div className="shrink-0 text-right">
      <button
        onClick={toggle}
        disabled={working}
        title="Click to toggle"
        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50 ${
          available
            ? "bg-green-100 text-green-800 hover:bg-green-200"
            : "bg-red-100 text-red-800 hover:bg-red-200"
        }`}
      >
        {working ? "..." : available ? "Available" : "Unavailable"}
      </button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
