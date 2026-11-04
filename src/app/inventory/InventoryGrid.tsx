"use client";

import { useState } from "react";
import Link from "next/link";
import type { Bike } from "@/lib/types";
import { useLang } from "@/lib/lang";
import { translations, type Translations } from "@/content/translations";

const ALL = "__all__";

function BikeCard({ bike, t }: { bike: Bike; t: Translations["inventory"] }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200">
        {bike.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bike.image}
            alt={bike.name}
            className="w-full h-full object-cover"
          />
        )}
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
            {bike.available ? t.available : t.checkedOut}
          </span>
        </div>
        <p className="text-green-600 font-medium text-sm mb-1">{bike.type}</p>
        <p className="text-gray-500 text-sm mb-1">{bike.size}</p>
        <p className="text-amber-600 text-sm mb-3 font-medium">{t.maxLoan} {bike.maxLoanPeriod}</p>
        <p className="text-gray-600 text-sm mb-4">{bike.description}</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {bike.features.map((feature, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
            >
              {feature}
            </span>
          ))}
        </div>
        {bike.available ? (
          <Link
            href={`/reserve/${bike.id}`}
            className="block w-full text-center bg-green-700 text-white px-4 py-2 rounded-full font-medium hover:bg-green-600 transition-colors"
          >
            {t.reserveThis}
          </Link>
        ) : (
          <button
            disabled
            className="block w-full text-center bg-gray-200 text-gray-500 px-4 py-2 rounded-full font-medium cursor-not-allowed"
          >
            {t.currentlyCheckedOut}
          </button>
        )}
      </div>
    </div>
  );
}

export default function InventoryGrid({
  bikes,
  types,
}: {
  bikes: Bike[];
  types: string[];
}) {
  const [selectedType, setSelectedType] = useState(ALL);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const { lang } = useLang();
  const t = translations[lang].inventory;
  const availableCount = bikes.filter((b) => b.available).length;

  const filteredBikes = bikes.filter((bike) => {
    const typeMatch = selectedType === ALL || bike.type === selectedType;
    const availableMatch = !showAvailableOnly || bike.available;
    return typeMatch && availableMatch;
  });

  return (
    <div className="py-12">
      {/* Header */}
      <section className="max-w-6xl mx-auto px-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{t.title}</h1>
        <p className="text-lg text-gray-600 mb-6">{t.intro(availableCount, bikes.length)}</p>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              {t.bikeType}
            </label>
            <select
              id="type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value={ALL}>{t.allTypes}</option>
              {types.map((type) => (
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
              <span className="text-sm text-gray-700">{t.showAvailableOnly}</span>
            </label>
          </div>
        </div>
      </section>

      {/* Bike Grid */}
      <section className="max-w-6xl mx-auto px-4">
        {filteredBikes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBikes.map((bike) => (
              <BikeCard key={bike.id} bike={bike} t={t} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {bikes.length === 0 ? t.noBikesYet : t.noMatch}
            </p>
            {bikes.length > 0 && (
              <button
                onClick={() => {
                  setSelectedType(ALL);
                  setShowAvailableOnly(false);
                }}
                className="mt-4 text-green-600 hover:text-green-700 font-medium"
              >
                {t.clearFilters}
              </button>
            )}
          </div>
        )}
      </section>

      {/* How to Borrow CTA */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <div className="bg-green-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.howTitle}</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">{t.howBody}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/learn"
              className="bg-white text-green-700 border-2 border-green-700 px-6 py-2 rounded-full font-medium hover:bg-green-50 transition-colors"
            >
              {t.watchVideo}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
