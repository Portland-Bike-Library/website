"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bike } from "@/content/inventory";
import { waiverContent } from "@/content/waiver";

export default function ReserveForm({ bike }: { bike: Bike }) {
  const [borrowerName, setBorrowerName] = useState("");
  const [borrowerEmail, setBorrowerEmail] = useState("");
  const [borrowerPhone, setBorrowerPhone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [printedName, setPrintedName] = useState("");
  const [signature, setSignature] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [includeMinor, setIncludeMinor] = useState(false);
  const [minorName, setMinorName] = useState("");
  const [minorDob, setMinorDob] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError("You must agree to the waiver to submit a reservation.");
      return;
    }
    if (borrowerName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!borrowerEmail.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Please choose start and end dates.");
      return;
    }
    if (printedName.trim().length < 2) {
      setError("Please enter your printed legal name.");
      return;
    }
    if (signature.trim().length < 2) {
      setError("Please enter your signature.");
      return;
    }
    if (includeMinor) {
      if (minorName.trim().length < 2) {
        setError("Please enter the minor child's name.");
        return;
      }
      if (!minorDob) {
        setError("Please enter the minor child's date of birth.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          borrowerName: borrowerName.trim(),
          borrowerEmail: borrowerEmail.trim(),
          borrowerPhone: borrowerPhone.trim() || undefined,
          bikeId: bike.id,
          startDate,
          endDate,
          printedName: printedName.trim(),
          signature: signature.trim(),
          agreed: true,
          minor: includeMinor
            ? { name: minorName.trim(), dateOfBirth: minorDob }
            : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <div className="text-5xl mb-4">&#9989;</div>
            <h1 className="text-3xl font-bold text-green-800 mb-4">
              Reservation Received
            </h1>
            <p className="text-green-700 mb-2">
              Thanks, {borrowerName.split(" ")[0] || "rider"}. We&apos;ll review your
              request for the <strong>{bike.name}</strong> and email you at{" "}
              <strong>{borrowerEmail}</strong> within 48 hours to confirm pickup
              details.
            </p>
            <p className="text-green-600 text-sm mt-4">
              Questions? Email{" "}
              <a className="underline" href="mailto:hello@portlandbikelibrary.org">
                hello@portlandbikelibrary.org
              </a>
              .
            </p>
            <div className="mt-6 flex gap-4 justify-center">
              <Link
                href="/inventory"
                className="bg-green-700 text-white px-6 py-2 rounded-full font-medium hover:bg-green-600 transition-colors"
              >
                Browse More Bikes
              </Link>
              <Link
                href="/"
                className="border border-green-700 text-green-700 px-6 py-2 rounded-full font-medium hover:bg-green-50 transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/inventory" className="text-green-700 text-sm hover:underline">
          &larr; Back to inventory
        </Link>
        <h1 className="text-4xl font-bold text-gray-800 mt-4 mb-2">
          Reserve the {bike.name}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Submit a reservation request and sign the waiver in one step. We&apos;ll
          confirm pickup details by email within 48 hours.
        </p>

        {/* Bike summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex gap-6 items-start">
          <div className="relative w-32 h-32 shrink-0 bg-gray-100 rounded-md overflow-hidden">
            <Image
              src={bike.image}
              alt={bike.name}
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm text-green-700 font-medium">{bike.type}</p>
            <h2 className="text-xl font-semibold text-gray-800">{bike.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{bike.size}</p>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Max loan period:</strong> {bike.maxLoanPeriod}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Borrower */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Info</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="borrowerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full name
                </label>
                <input
                  id="borrowerName"
                  type="text"
                  required
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label htmlFor="borrowerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="borrowerEmail"
                  type="email"
                  required
                  value={borrowerEmail}
                  onChange={(e) => setBorrowerEmail(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label htmlFor="borrowerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-gray-400">(optional, helps with pickup)</span>
                </label>
                <input
                  id="borrowerPhone"
                  type="tel"
                  value={borrowerPhone}
                  onChange={(e) => setBorrowerPhone(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </section>

          {/* Dates */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Requested Dates</h2>
            <p className="text-sm text-gray-600 mb-4">
              This bike&apos;s max loan period is <strong>{bike.maxLoanPeriod}</strong>.
              We&apos;ll confirm exact dates with you.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start date
                </label>
                <input
                  id="startDate"
                  type="date"
                  required
                  min={today}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End date
                </label>
                <input
                  id="endDate"
                  type="date"
                  required
                  min={startDate || today}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </section>

          {/* Waiver */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{waiverContent.title}</h2>
            <p className="text-sm text-gray-600 mb-6">{waiverContent.subtitle}</p>

            <p className="text-gray-700 mb-4 font-medium">{waiverContent.introduction}</p>
            <ol className="space-y-3 mb-6">
              {waiverContent.clauses.map((clause) => (
                <li key={clause.number} className="text-gray-700 leading-relaxed">
                  <span className="font-semibold text-green-700">{clause.number}.</span>{" "}
                  {clause.text}
                </li>
              ))}
            </ol>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700 text-sm">{waiverContent.acknowledgment}</p>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700 text-sm">
                  I have read and understood the above waiver. I agree to all terms
                  and acknowledge that I am giving up substantial legal rights by
                  signing this document.
                </span>
              </label>

              <div>
                <label htmlFor="printedName" className="block text-sm font-medium text-gray-700 mb-1">
                  Printed legal name
                </label>
                <input
                  id="printedName"
                  type="text"
                  required
                  value={printedName}
                  onChange={(e) => setPrintedName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label htmlFor="signature" className="block text-sm font-medium text-gray-700 mb-1">
                  Signature (type your full name)
                </label>
                <input
                  id="signature"
                  type="text"
                  required
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-lg font-serif italic"
                />
              </div>

              <p className="text-xs text-gray-500">
                Date: {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Minor block */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600 mb-3">{waiverContent.minorNotice}</p>
              <label className="flex items-start gap-3 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={includeMinor}
                  onChange={(e) => setIncludeMinor(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700 text-sm">
                  I am completing this waiver on behalf of a minor child, and I take
                  responsibility for their liability and risk as outlined above.
                </span>
              </label>

              {includeMinor && (
                <div className="pl-7 space-y-3">
                  <div>
                    <label htmlFor="minorName" className="block text-sm font-medium text-gray-700 mb-1">
                      Minor child&apos;s full name
                    </label>
                    <input
                      id="minorName"
                      type="text"
                      value={minorName}
                      onChange={(e) => setMinorName(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="minorDob" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of birth
                    </label>
                    <input
                      id="minorDob"
                      type="date"
                      value={minorDob}
                      onChange={(e) => setMinorDob(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md">{error}</div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !agreed}
              className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Reservation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
