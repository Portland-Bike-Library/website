"use client";

import { useState } from "react";
import { bikes, bikeTypes, Bike } from "@/content/inventory";
import Link from "next/link";

function BikeCard({ bike }: { bike: Bike }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200">
        <img
          src={bike.image}
          alt={bike.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{bike.name}</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              bike.available
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {bike.available ? "Available" : "Checked Out"}
          </span>
        </div>
        <p className="text-green-600 font-medium text-sm mb-1">{bike.type}</p>
        <p className="text-gray-500 text-sm mb-1">{bike.size}</p>
        <p className="text-amber-600 text-sm mb-3 font-medium">Max loan: {bike.maxLoanPeriod}</p>
        <p className="text-gray-600 text-sm mb-4">{bike.description}</p>
        <div className="flex flex-wrap gap-2">
          {bike.features.map((feature, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const [selectedType, setSelectedType] = useState("All Types");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const filteredBikes = bikes.filter((bike) => {
    const typeMatch = selectedType === "All Types" || bike.type === selectedType;
    const availableMatch = !showAvailableOnly || bike.available;
    return typeMatch && availableMatch;
  });

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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Bike Type
            </label>
            <select
              id="type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-green-500 focus:border-green-500"
            >
              {bikeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={(e) => setShowAvailableOnly(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Show available only</span>
            </label>
          </div>
        </div>
      </section>

      {/* Bike Grid */}
      <section className="max-w-6xl mx-auto px-4">
        {filteredBikes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBikes.map((bike) => (
              <BikeCard key={bike.id} bike={bike} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No bikes match your filters.</p>
            <button
              onClick={() => {
                setSelectedType("All Types");
                setShowAvailableOnly(false);
              }}
              className="mt-4 text-green-600 hover:text-green-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* How to Borrow CTA */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <div className="bg-green-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Want to Borrow a Bike?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            To borrow a bike from our library, you&apos;ll need to create an account,
            watch our safety video, and sign our waiver. It only takes a few minutes!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/learn"
              className="bg-white text-green-700 border-2 border-green-700 px-6 py-2 rounded-full font-medium hover:bg-green-50 transition-colors"
            >
              Watch Safety Video
            </Link>
            <Link
              href="/waiver"
              className="bg-green-700 text-white px-6 py-2 rounded-full font-medium hover:bg-green-600 transition-colors"
            >
              Sign Waiver
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
