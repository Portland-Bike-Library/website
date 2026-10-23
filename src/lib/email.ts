// Transactional email via Resend's REST API. No-ops (with a log line) when
// RESEND_API_KEY is unset so local dev and previews never fail on email.
import { organization } from "@/content/organization";

const FROM =
  process.env.EMAIL_FROM ?? `Portland Bike Library <reservations@portlandbikelibrary.org>`;
const ADMIN_TO = process.env.ADMIN_NOTIFY_EMAIL ?? organization.contact.email;
const SITE = process.env.SITE_URL ?? "https://www.portlandbikelibrary.org";

interface SendArgs {
  to: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, text, replyTo }: SendArgs): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[email] RESEND_API_KEY unset; skipping "${subject}" to ${to}`);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: Array.isArray(to) ? to : [to],
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) {
      console.error(`[email] Resend ${res.status}:`, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] send failed:", err);
    return false;
  }
}

export interface ReservationSummary {
  id: string;
  borrower_name: string;
  borrower_email: string;
  borrower_phone: string | null;
  bike_name: string;
  start_date: string;
  end_date: string;
  minor_name: string | null;
}

function fmt(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function dates(r: ReservationSummary): string {
  return `${fmt(r.start_date)} – ${fmt(r.end_date)}`;
}

const SIGNOFF = `\n\n— Portland Bike Library\n${ADMIN_TO}`;

export function notifyAdminNewReservation(r: ReservationSummary) {
  const lines = [
    `New reservation request for the ${r.bike_name}.`,
    ``,
    `Borrower: ${r.borrower_name}`,
    `Email: ${r.borrower_email}`,
    r.borrower_phone ? `Phone: ${r.borrower_phone}` : null,
    r.minor_name ? `Rider (minor): ${r.minor_name}` : null,
    `Dates: ${dates(r)}`,
    ``,
    `Review it: ${SITE}/admin`,
  ].filter((l) => l !== null);
  return sendEmail({
    to: ADMIN_TO,
    subject: `New reservation: ${r.bike_name} — ${r.borrower_name}`,
    text: lines.join("\n"),
    replyTo: r.borrower_email,
  });
}

export function notifyBorrowerReceived(r: ReservationSummary) {
  return sendEmail({
    to: r.borrower_email,
    subject: `We got your request for the ${r.bike_name}`,
    text:
      `Hi ${r.borrower_name.split(" ")[0]},\n\n` +
      `Thanks for your reservation request for the ${r.bike_name} (${dates(r)}). ` +
      `We'll review it and email you within 48 hours to confirm pickup details.\n\n` +
      `Reply to this email if anything changes.` +
      SIGNOFF,
  });
}

export function notifyBorrowerApproved(r: ReservationSummary, notes?: string) {
  return sendEmail({
    to: r.borrower_email,
    subject: `Approved: ${r.bike_name}, ${dates(r)}`,
    text:
      `Hi ${r.borrower_name.split(" ")[0]},\n\n` +
      `Good news: your reservation for the ${r.bike_name} (${dates(r)}) is approved.\n\n` +
      (notes ? `${notes}\n\n` : ``) +
      `We'll reply on this thread to arrange pickup. Please bring a helmet for every rider.` +
      SIGNOFF,
  });
}

export function notifyBorrowerDenied(r: ReservationSummary, notes?: string) {
  return sendEmail({
    to: r.borrower_email,
    subject: `Update on your ${r.bike_name} request`,
    text:
      `Hi ${r.borrower_name.split(" ")[0]},\n\n` +
      `Unfortunately we can't fulfill your request for the ${r.bike_name} (${dates(r)}).\n\n` +
      (notes ? `${notes}\n\n` : ``) +
      `Feel free to request different dates or another bike at ${SITE}/inventory.` +
      SIGNOFF,
  });
}

export function notifyBorrowerPickedUp(r: ReservationSummary) {
  return sendEmail({
    to: r.borrower_email,
    subject: `Enjoy the ${r.bike_name}! Due back ${fmt(r.end_date)}`,
    text:
      `Hi ${r.borrower_name.split(" ")[0]},\n\n` +
      `You've picked up the ${r.bike_name}. It's due back on ${fmt(r.end_date)}.\n\n` +
      `Ride safe, wear a helmet, and reply here if you have any trouble with the bike.` +
      SIGNOFF,
  });
}
