import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";
import { parseBikeInput, inputToRow } from "@/lib/bike-input";

type Ctx = { params: Promise<{ id: string }> };

// Full update. Body may also carry just { available } for a quick toggle.
export async function PATCH(request: NextRequest, { params }: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  let update: Record<string, unknown>;
  if (body && typeof body === "object" && Object.keys(body).length === 1 && "available" in body) {
    update = { available: body.available === true };
  } else {
    const parsed = parseBikeInput({ ...body, id });
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    update = inputToRow(parsed.value);
    delete update.id; // id is the route param; never rename (reservations reference it)
  }

  const { data, error } = await supabaseAdmin
    .from("bikes")
    .update(update)
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error) {
    console.error("Bike update failed:", error);
    return NextResponse.json({ error: "Failed to update bike." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Bike not found." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: NextRequest, { params }: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { id } = await params;

  // Refuse while a reservation is open on this bike.
  const { count } = await supabaseAdmin
    .from("reservations")
    .select("id", { count: "exact", head: true })
    .eq("bike_id", id)
    .in("status", ["pending", "approved", "picked_up"]);
  if (count && count > 0) {
    return NextResponse.json(
      { error: `This bike has ${count} open reservation(s). Resolve them first, or mark the bike unavailable instead.` },
      { status: 409 }
    );
  }

  const { error } = await supabaseAdmin.from("bikes").delete().eq("id", id);
  if (error) {
    console.error("Bike delete failed:", error);
    return NextResponse.json({ error: "Failed to delete bike." }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
