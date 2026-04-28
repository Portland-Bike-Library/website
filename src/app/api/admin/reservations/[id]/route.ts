import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";
import type { ReservationStatus } from "@/lib/types";

type Action = "approve" | "deny" | "pickup" | "return" | "cancel";

const VALID_ACTIONS: Action[] = ["approve", "deny", "pickup", "return", "cancel"];

const ALLOWED_FROM: Record<Action, ReservationStatus[]> = {
  approve: ["pending"],
  deny: ["pending"],
  pickup: ["approved"],
  return: ["picked_up"],
  cancel: ["pending", "approved", "picked_up"],
};

const NEXT_STATUS: Record<Action, ReservationStatus> = {
  approve: "approved",
  deny: "denied",
  pickup: "picked_up",
  return: "returned",
  cancel: "cancelled",
};

const TIMESTAMP_FIELD: Partial<Record<Action, string>> = {
  approve: "approved_at",
  pickup: "picked_up_at",
  return: "returned_at",
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const action = body?.action as Action | undefined;
  const notes = typeof body?.notes === "string" ? body.notes.trim() : undefined;

  if (!action || !VALID_ACTIONS.includes(action)) {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  const { data: row, error: fetchErr } = await supabaseAdmin
    .from("reservations")
    .select("status")
    .eq("id", id)
    .single();
  if (fetchErr || !row) {
    return NextResponse.json({ error: "Reservation not found." }, { status: 404 });
  }
  if (!ALLOWED_FROM[action].includes(row.status as ReservationStatus)) {
    return NextResponse.json(
      { error: `Cannot ${action} a reservation in status "${row.status}".` },
      { status: 400 }
    );
  }

  const update: Record<string, unknown> = { status: NEXT_STATUS[action] };
  const tsField = TIMESTAMP_FIELD[action];
  if (tsField) update[tsField] = new Date().toISOString();
  if (notes) update.admin_notes = notes;

  const { error: updateErr } = await supabaseAdmin
    .from("reservations")
    .update(update)
    .eq("id", id);
  if (updateErr) {
    console.error("Reservation update failed:", updateErr);
    return NextResponse.json({ error: "Failed to update reservation." }, { status: 500 });
  }

  return NextResponse.json({ success: true, status: NEXT_STATUS[action] });
}
