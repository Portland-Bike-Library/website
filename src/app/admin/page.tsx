import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";
import type { Reservation, ReservationStatus } from "@/lib/types";
import ReservationActions from "./ReservationActions";
import LogoutButton from "./LogoutButton";

const STATUS_LABEL: Record<ReservationStatus, string> = {
  pending: "Pending",
  approved: "Approved — awaiting pickup",
  denied: "Denied",
  picked_up: "Picked up",
  returned: "Returned",
  cancelled: "Cancelled",
};

const STATUS_COLOR: Record<ReservationStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  denied: "bg-gray-200 text-gray-700",
  picked_up: "bg-green-100 text-green-800",
  returned: "bg-gray-100 text-gray-600",
  cancelled: "bg-gray-200 text-gray-600",
};

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString();
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString();
}

function ReservationRow({ r }: { r: Reservation }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-3">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="text-lg font-semibold text-gray-800">{r.borrower_name}</p>
          <p className="text-sm text-gray-600">
            <a className="hover:underline" href={`mailto:${r.borrower_email}`}>
              {r.borrower_email}
            </a>
            {r.borrower_phone && (
              <>
                {" "}&bull;{" "}
                <a className="hover:underline" href={`tel:${r.borrower_phone}`}>
                  {r.borrower_phone}
                </a>
              </>
            )}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${STATUS_COLOR[r.status]}`}
        >
          {STATUS_LABEL[r.status]}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-700 mb-3">
        <p>
          <span className="text-gray-500">Bike:</span> {r.bike_name}
        </p>
        <p>
          <span className="text-gray-500">Dates:</span> {formatDate(r.start_date)} &rarr;{" "}
          {formatDate(r.end_date)}
        </p>
        <p>
          <span className="text-gray-500">Submitted:</span>{" "}
          {formatDateTime(r.created_at)}
        </p>
        {r.minor_name && (
          <p>
            <span className="text-gray-500">Rider (minor):</span> {r.minor_name}
            {r.minor_dob && ` (DOB ${formatDate(r.minor_dob)})`}
          </p>
        )}
      </div>

      <details className="text-xs text-gray-600">
        <summary className="cursor-pointer hover:text-gray-800">Waiver record</summary>
        <div className="mt-2 space-y-1">
          <p>
            <span className="text-gray-500">Printed name:</span>{" "}
            {r.waiver_printed_name}
          </p>
          <p>
            <span className="text-gray-500">Signature:</span>{" "}
            <span className="font-serif italic">{r.waiver_signature}</span>
          </p>
          <p>
            <span className="text-gray-500">Signed at:</span>{" "}
            {formatDateTime(r.waiver_signed_at)}
          </p>
          {r.waiver_ip && (
            <p>
              <span className="text-gray-500">IP:</span> {r.waiver_ip}
            </p>
          )}
        </div>
      </details>

      {r.admin_notes && (
        <p className="mt-2 text-xs text-gray-600">
          <span className="text-gray-500">Notes:</span> {r.admin_notes}
        </p>
      )}

      <ReservationActions id={r.id} status={r.status} />
    </div>
  );
}

export default async function AdminPage() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  const { data, error } = await supabaseAdmin
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin reservations fetch failed:", error);
  }
  const all = (data ?? []) as Reservation[];
  const pending = all.filter((r) => r.status === "pending");
  const active = all.filter(
    (r) => r.status === "approved" || r.status === "picked_up"
  );
  const history = all.filter(
    (r) =>
      r.status === "denied" || r.status === "returned" || r.status === "cancelled"
  );

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin</h1>
          <LogoutButton />
        </div>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Pending requests <span className="text-gray-500 font-normal">({pending.length})</span>
          </h2>
          {pending.length === 0 ? (
            <p className="text-sm text-gray-500">Nothing pending.</p>
          ) : (
            pending.map((r) => <ReservationRow key={r.id} r={r} />)
          )}
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Active loans <span className="text-gray-500 font-normal">({active.length})</span>
          </h2>
          {active.length === 0 ? (
            <p className="text-sm text-gray-500">No active loans.</p>
          ) : (
            active.map((r) => <ReservationRow key={r.id} r={r} />)
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            History <span className="text-gray-500 font-normal">({history.length})</span>
          </h2>
          {history.length === 0 ? (
            <p className="text-sm text-gray-500">No history yet.</p>
          ) : (
            history.map((r) => <ReservationRow key={r.id} r={r} />)
          )}
        </section>
      </div>
    </div>
  );
}
