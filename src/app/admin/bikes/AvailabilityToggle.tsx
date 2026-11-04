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
        type="button"
        role="switch"
        aria-checked={available}
        onClick={toggle}
        disabled={working}
        title={available ? "Click to mark unavailable" : "Click to mark available"}
        className="inline-flex items-center gap-2 disabled:opacity-50"
      >
        <span
          className={`relative inline-block w-10 h-6 rounded-full transition-colors ${
            available ? "bg-green-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              available ? "translate-x-4" : ""
            }`}
          />
        </span>
        <span className={`text-xs font-medium w-20 text-left ${available ? "text-green-800" : "text-gray-500"}`}>
          {working ? "Saving..." : available ? "Available" : "Unavailable"}
        </span>
      </button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
