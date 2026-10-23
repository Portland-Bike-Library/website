import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getBikes } from "@/lib/bikes";
import AvailabilityToggle from "./AvailabilityToggle";

export const dynamic = "force-dynamic";

export default async function AdminBikesPage() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
  const bikes = await getBikes();

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/admin" className="text-green-700 text-sm hover:underline">
          &larr; Reservations
        </Link>
        <div className="flex items-baseline justify-between mt-2 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Bikes <span className="text-gray-500 font-normal text-xl">({bikes.length})</span>
          </h1>
          <Link
            href="/admin/bikes/new"
            className="bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
          >
            + Add bike
          </Link>
        </div>

        {bikes.length === 0 ? (
          <p className="text-sm text-gray-500">No bikes yet. Add one to list it on the site.</p>
        ) : (
          bikes.map((b) => (
            <div key={b.id} className="bg-white rounded-lg shadow-md p-4 mb-3 flex gap-4 items-center">
              <div className="w-20 h-20 shrink-0 bg-gray-100 rounded-md overflow-hidden">
                {b.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.image} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-lg font-semibold text-gray-800 truncate">{b.name}</p>
                <p className="text-sm text-gray-600">
                  {b.type} &bull; {b.size || "—"} &bull; max {b.maxLoanPeriod}
                </p>
                <p className="text-xs text-gray-400 font-mono">{b.id}</p>
              </div>
              <AvailabilityToggle id={b.id} available={b.available} />
              <Link
                href={`/admin/bikes/${b.id}`}
                className="border border-gray-400 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors shrink-0"
              >
                Edit
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
