import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { bikes } from "@/content/inventory";

const MAX_DAYS = 90; // hard cap; bike-specific limits shown in form copy
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isIsoDate(s: unknown): s is string {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function getClientIp(req: NextRequest): string | null {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || null;
  return req.headers.get("x-real-ip");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      borrowerName,
      borrowerEmail,
      borrowerPhone,
      bikeId,
      startDate,
      endDate,
      printedName,
      signature,
      minor,
      agreed,
    } = body ?? {};

    if (agreed !== true) {
      return NextResponse.json(
        { error: "You must agree to the waiver to submit a reservation." },
        { status: 400 }
      );
    }

    if (typeof borrowerName !== "string" || borrowerName.trim().length < 2) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }
    if (typeof borrowerEmail !== "string" || !EMAIL_RE.test(borrowerEmail.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    const phone =
      typeof borrowerPhone === "string" && borrowerPhone.trim().length > 0
        ? borrowerPhone.trim()
        : null;

    const bike = bikes.find((b) => b.id === bikeId);
    if (!bike) {
      return NextResponse.json({ error: "Bike not found." }, { status: 400 });
    }

    if (!isIsoDate(startDate) || !isIsoDate(endDate)) {
      return NextResponse.json({ error: "Please choose valid start and end dates." }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");
    if (start < today) {
      return NextResponse.json({ error: "Start date can't be in the past." }, { status: 400 });
    }
    if (end < start) {
      return NextResponse.json({ error: "End date must be on or after start date." }, { status: 400 });
    }
    const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (days > MAX_DAYS) {
      return NextResponse.json(
        { error: `Reservations can't exceed ${MAX_DAYS} days. Reach out if you need longer.` },
        { status: 400 }
      );
    }

    if (typeof printedName !== "string" || printedName.trim().length < 2) {
      return NextResponse.json({ error: "Please enter your printed legal name." }, { status: 400 });
    }
    if (typeof signature !== "string" || signature.trim().length < 2) {
      return NextResponse.json({ error: "Please enter your signature." }, { status: 400 });
    }

    let minorName: string | null = null;
    let minorDob: string | null = null;
    if (minor) {
      if (typeof minor.name !== "string" || minor.name.trim().length < 2) {
        return NextResponse.json({ error: "Please enter the minor child's name." }, { status: 400 });
      }
      if (!isIsoDate(minor.dateOfBirth)) {
        return NextResponse.json({ error: "Please enter the minor child's date of birth." }, { status: 400 });
      }
      minorName = minor.name.trim();
      minorDob = minor.dateOfBirth;
    }

    const ip = getClientIp(request);
    const userAgent = request.headers.get("user-agent");

    const { data, error } = await supabaseAdmin
      .from("reservations")
      .insert({
        borrower_name: borrowerName.trim(),
        borrower_email: borrowerEmail.trim().toLowerCase(),
        borrower_phone: phone,
        bike_id: bike.id,
        bike_name: bike.name,
        start_date: startDate,
        end_date: endDate,
        minor_name: minorName,
        minor_dob: minorDob,
        waiver_printed_name: printedName.trim(),
        waiver_signature: signature.trim(),
        waiver_ip: ip,
        waiver_user_agent: userAgent,
        status: "pending",
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("Reservation insert failed:", error);
      return NextResponse.json(
        { error: "We couldn't save your reservation. Please try again or email us." },
        { status: 500 }
      );
    }

    // TODO: send admin notification email via Resend once configured.
    console.log(`[reserve] new reservation ${data.id} for bike ${bike.id} from ${borrowerEmail}`);

    return NextResponse.json({ reservationId: data.id });
  } catch (error) {
    console.error("Reserve route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
