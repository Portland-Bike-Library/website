"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Bike } from "@/lib/types";
import { waiverContent, waiverContentEs } from "@/content/waiver";
import { useLang } from "@/lib/lang";
import { translations } from "@/content/translations";
import WaiverText from "@/components/WaiverText";

export default function ReserveForm({ bike }: { bike: Bike }) {
  const { lang } = useLang();
  const t = translations[lang].reserve;
  const minorNotice = (lang === "es" ? waiverContentEs : waiverContent).minorNotice;
  const [borrowerName, setBorrowerName] = useState("");
  const [borrowerEmail, setBorrowerEmail] = useState("");
  const [borrowerPhone, setBorrowerPhone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [printedName, setPrintedName] = useState("");
  const [signature, setSignature] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [watchedVideo, setWatchedVideo] = useState(false);
  const [includeMinor, setIncludeMinor] = useState(false);
  const [minorName, setMinorName] = useState("");
  const [minorDob, setMinorDob] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!watchedVideo) {
      setError(t.errors.video);
      return;
    }
    if (!agreed) {
      setError(t.errors.agree);
      return;
    }
    if (borrowerName.trim().length < 2) {
      setError(t.errors.name);
      return;
    }
    if (!borrowerEmail.trim()) {
      setError(t.errors.email);
      return;
    }
    if (!startDate || !endDate) {
      setError(t.errors.dates);
      return;
    }
    if (printedName.trim().length < 2) {
      setError(t.errors.printedName);
      return;
    }
    if (signature.trim().length < 2) {
      setError(t.errors.signature);
      return;
    }
    if (includeMinor) {
      if (minorName.trim().length < 2) {
        setError(t.errors.minorName);
        return;
      }
      if (!minorDob) {
        setError(t.errors.minorDob);
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
          watchedVideo: true,
          minor: includeMinor
            ? { name: minorName.trim(), dateOfBirth: minorDob }
            : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || t.errors.generic);
      }
    } catch {
      setError(t.errors.unexpected);
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
              {t.receivedTitle}
            </h1>
            <p className="text-green-700 mb-2">
              {t.receivedBefore(borrowerName.split(" ")[0] || "rider")}
              <strong>{bike.name}</strong>
              {t.receivedMiddle}
              <strong>{borrowerEmail}</strong>
              {t.receivedAfter}
            </p>
            <p className="text-green-600 text-sm mt-4">
              {t.questions}
              <a className="underline" href="mailto:contact@portlandbikelibrary.org">
                contact@portlandbikelibrary.org
              </a>
              .
            </p>
            <div className="mt-6 flex gap-4 justify-center">
              <Link
                href="/inventory"
                className="bg-green-700 text-white px-6 py-2 rounded-full font-medium hover:bg-green-600 transition-colors"
              >
                {t.browseMore}
              </Link>
              <Link
                href="/"
                className="border border-green-700 text-green-700 px-6 py-2 rounded-full font-medium hover:bg-green-50 transition-colors"
              >
                {t.home}
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
          &larr; {t.back}
        </Link>
        <h1 className="text-4xl font-bold text-gray-800 mt-4 mb-2">
          {t.title(bike.name)}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {t.intro}
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
              <strong>{t.maxLoanPeriod}</strong> {bike.maxLoanPeriod}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Safety video */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{t.safetyTitle}</h2>
            <p className="text-sm text-gray-600 mb-4">
              {t.safetyBefore}
              <Link href="/learn" target="_blank" className="text-green-700 underline">
                {t.safetyLink}
              </Link>
              {t.safetyAfter}
            </p>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={watchedVideo}
                onChange={(e) => setWatchedVideo(e.target.checked)}
                className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-gray-700 text-sm">
                {t.safetyCheckbox}
              </span>
            </label>
          </section>

          {/* Borrower */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.yourInfo}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="borrowerName" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.fullName}
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
                  {t.email}
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
                  {t.phone} <span className="text-gray-400">{t.phoneHint}</span>
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
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{t.datesTitle}</h2>
            <p className="text-sm text-gray-600 mb-4">
              {t.datesBefore}<strong>{bike.maxLoanPeriod}</strong>{t.datesAfter}
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.startDate}
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
                  {t.endDate}
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
            <WaiverText compact />

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700 text-sm">
                  {t.agree}
                </span>
              </label>

              <div>
                <label htmlFor="printedName" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.printedName}
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
                  {t.signature}
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
                {t.date} {new Date().toLocaleDateString(lang === "es" ? "es-US" : "en-US")}
              </p>
            </div>

            {/* Minor block */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600 mb-3">{minorNotice}</p>
              <label className="flex items-start gap-3 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={includeMinor}
                  onChange={(e) => setIncludeMinor(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700 text-sm">
                  {t.minorCheckbox}
                </span>
              </label>

              {includeMinor && (
                <div className="pl-7 space-y-3">
                  <div>
                    <label htmlFor="minorName" className="block text-sm font-medium text-gray-700 mb-1">
                      {t.minorName}
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
                      {t.minorDob}
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
              disabled={submitting || !agreed || !watchedVideo}
              className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? t.submitting : t.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
