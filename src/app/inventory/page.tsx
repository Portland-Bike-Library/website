import Link from "next/link";
import { getBikes, bikeTypesFrom } from "@/lib/bikes";
import InventoryGrid from "./InventoryGrid";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const bikes = await getBikes();
  const availableCount = bikes.filter((b) => b.available).length;

  return (
    <div className="py-12">
      {/* Header */}
      <section className="max-w-6xl mx-auto px-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Bikes</h1>
        <p className="text-lg text-gray-600 mb-6">
          Browse our collection of bikes available for borrowing. We have {availableCount} of {bikes.length} bikes
          currently available.
        </p>
      </section>

      <InventoryGrid bikes={bikes} types={bikeTypesFrom(bikes)} />

      {/* How to Borrow CTA */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <div className="bg-green-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            How borrowing works
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Pick a bike, fill out the reservation form (it includes our safety waiver),
            and we&apos;ll email you within 48 hours to confirm pickup. We recommend
            watching the safety video before your first ride.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/learn"
              className="bg-white text-green-700 border-2 border-green-700 px-6 py-2 rounded-full font-medium hover:bg-green-50 transition-colors"
            >
              Watch Safety Video
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
