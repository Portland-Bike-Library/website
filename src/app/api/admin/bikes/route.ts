import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";
import { parseBikeInput, inputToRow } from "@/lib/bike-input";

// Create a bike
export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const parsed = parseBikeInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("bikes").insert(inputToRow(parsed.value));
  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: `A bike with ID "${parsed.value.id}" already exists.` },
        { status: 409 }
      );
    }
    console.error("Bike insert failed:", error);
    return NextResponse.json({ error: "Failed to create bike." }, { status: 500 });
  }
  return NextResponse.json({ id: parsed.value.id });
}
