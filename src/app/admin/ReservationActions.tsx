"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ReservationStatus } from "@/lib/types";

type Action = "approve" | "deny" | "pickup" | "return" | "cancel";

const ACTIONS_FOR_STATUS: Record<ReservationStatus, Action[]> = {
  pending: ["approve", "deny", "cancel"],
  approved: ["pickup", "cancel"],
  picked_up: ["return", "cancel"],
  denied: [],
  returned: [],
  cancelled: [],
};

const ACTION_LABEL: Record<Action, string> = {
  approve: "Approve",
  deny: "Deny",
  pickup: "Mark picked up",
  return: "Mark returned",
  cancel: "Cancel",
};

const ACTION_STYLE: Record<Action, string> = {
  approve: "bg-green-700 text-white hover:bg-green-600",
  deny: "bg-red-600 text-white hover:bg-red-500",
  pickup: "bg-blue-700 text-white hover:bg-blue-600",
  return: "bg-blue-700 text-white hover:bg-blue-600",
  cancel: "border border-gray-400 text-gray-700 hover:bg-gray-100",
};

const CONFIRM_FOR: Partial<Record<Action, string>> = {
  deny: "Deny this reservation?",
  cancel: "Cancel this reservation?",
};

export default function ReservationActions({
  id,
  status,
}: {
  id: string;
  status: ReservationStatus;
}) {
  const router = useRouter();
  const [working, setWorking] = useState<Action | null>(null);
  const [error, setError] = useState("");

  const actions = ACTIONS_FOR_STATUS[status];
  if (actions.length === 0) return null;

  const run = async (action: Action) => {
    const confirmMsg = CONFIRM_FOR[action];
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setError("");
    setWorking(action);
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Action failed.");
      }
    } catch {
      setError("Network error.");
    }
    setWorking(null);
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      {error && (
        <p className="text-sm text-red-600 mb-2">{error}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action}
            onClick={() => run(action)}
            disabled={working !== null}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${ACTION_STYLE[action]}`}
          >
            {working === action ? "..." : ACTION_LABEL[action]}
          </button>
        ))}
      </div>
    </div>
  );
}
