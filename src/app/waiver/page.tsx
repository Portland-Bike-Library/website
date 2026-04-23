"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { waiverContent } from "@/content/waiver";

export default function WaiverPage() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();
  const [printedName, setPrintedName] = useState("");
  const [signature, setSignature] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [includeMinor, setIncludeMinor] = useState(false);
  const [minorName, setMinorName] = useState("");
  const [minorDob, setMinorDob] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError("You must agree to the terms to sign the waiver");
      return;
    }

    if (printedName.trim().length < 2) {
      setError("Please enter your printed legal name");
      return;
    }

    if (signature.trim().length < 2) {
      setError("Please enter your full name as your signature");
      return;
    }

    if (includeMinor) {
      if (minorName.trim().length < 2) {
        setError("Please enter the minor child's name");
        return;
      }
      if (!minorDob) {
        setError("Please enter the minor child's date of birth");
        return;
      }
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/waiver/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          printedName: printedName.trim(),
          signature: signature.trim(),
          minor: includeMinor
            ? { name: minorName.trim(), dateOfBirth: minorDob }
            : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        await refreshUser();
        router.push("/inventory");
      } else {
        setError(data.error || "Failed to sign waiver");
      }
    } catch {
      setError("An unexpected error occurred");
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Not signed in
  if (!user) {
    return (
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">{waiverContent.title}</h1>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              Sign In Required
            </h2>
            <p className="text-yellow-700 mb-4">
              You need to create an account or sign in before you can sign the waiver.
            </p>
            <div className="flex gap-4">
              <Link
                href="/auth/signup"
                className="bg-green-700 text-white px-6 py-2 rounded-full font-medium hover:bg-green-600 transition-colors"
              >
                Create Account
              </Link>
              <Link
                href="/auth/signin"
                className="border border-green-700 text-green-700 px-6 py-2 rounded-full font-medium hover:bg-green-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Show waiver content for review */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Review the Waiver
            </h2>
            <p className="text-gray-600 mb-4">{waiverContent.introduction}</p>

            <ol className="space-y-4">
              {waiverContent.clauses.map((clause) => (
                <li key={clause.number} className="text-gray-700">
                  <span className="font-semibold">{clause.number}.</span> {clause.text}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // Signed in but hasn't completed orientation yet
  if (!user.hasWatchedVideo) {
    return (
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-yellow-800 mb-4">
              Complete Orientation First
            </h1>
            <p className="text-yellow-700 mb-6">
              The waiver asks you to confirm you have participated in a Portland Bike
              Library orientation. Please watch the safety video before signing.
            </p>
            <Link
              href="/learn"
              className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors"
            >
              Watch Safety Video
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Already signed waiver
  if (user.hasSignedWaiver) {
    return (
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <div className="text-5xl mb-4">&#9989;</div>
            <h1 className="text-3xl font-bold text-green-800 mb-4">
              Registration Complete
            </h1>
            <p className="text-green-700 mb-2">
              You signed the waiver on{" "}
              {user.waiverSignedAt
                ? new Date(user.waiverSignedAt).toLocaleDateString()
                : "record"}
              .
            </p>
            <p className="text-green-600 mb-2">
              Signature: <strong>{user.waiverSignature}</strong>
            </p>
            {user.waiverMinor && (
              <p className="text-green-600 mb-6">
                Also covers: <strong>{user.waiverMinor.name}</strong> (DOB{" "}
                {user.waiverMinor.dateOfBirth})
              </p>
            )}
            <div className="flex gap-4 justify-center">
              <Link
                href="/inventory"
                className="bg-green-700 text-white px-6 py-2 rounded-full font-medium hover:bg-green-600 transition-colors"
              >
                Browse Bikes
              </Link>
              <Link
                href="/account"
                className="border border-green-700 text-green-700 px-6 py-2 rounded-full font-medium hover:bg-green-50 transition-colors"
              >
                My Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sign waiver form
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{waiverContent.title}</h1>
        <p className="text-lg text-gray-600 mb-8">{waiverContent.subtitle}</p>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="text-gray-700 mb-6 font-medium">{waiverContent.introduction}</p>

          <ol className="space-y-4 mb-8">
            {waiverContent.clauses.map((clause) => (
              <li key={clause.number} className="text-gray-700 leading-relaxed">
                <span className="font-semibold text-green-700">{clause.number}.</span>{" "}
                {clause.text}
              </li>
            ))}
          </ol>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 font-medium">{waiverContent.acknowledgment}</p>
          </div>
        </div>

        {/* Signature Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign the Waiver</h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-gray-700">
                I have read and understood the above waiver. I agree to all terms and
                conditions, and I acknowledge that I am giving up substantial legal rights
                by signing this document.
              </span>
            </label>
          </div>

          <div className="mb-6">
            <label htmlFor="printedName" className="block text-sm font-medium text-gray-700 mb-2">
              Printed legal name
            </label>
            <input
              type="text"
              id="printedName"
              value={printedName}
              onChange={(e) => setPrintedName(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="Your Full Legal Name"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="signature" className="block text-sm font-medium text-gray-700 mb-2">
              Signature (type your full name)
            </label>
            <input
              type="text"
              id="signature"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-lg font-serif italic"
              placeholder="Your Signature"
            />
            <p className="text-sm text-gray-500 mt-1">
              Signing as: <strong>{user.name}</strong> ({user.email})
            </p>
          </div>

          {/* Minor block */}
          <div className="mb-6 border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 mb-3">{waiverContent.minorNotice}</p>
            <label className="flex items-start gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={includeMinor}
                onChange={(e) => setIncludeMinor(e.target.checked)}
                className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-gray-700">
                I am completing this waiver on behalf of a minor child, and I take
                responsibility for their liability and risk as outlined above.
              </span>
            </label>

            {includeMinor && (
              <div className="pl-7 space-y-4">
                <div>
                  <label htmlFor="minorName" className="block text-sm font-medium text-gray-700 mb-2">
                    Minor child&apos;s full name
                  </label>
                  <input
                    type="text"
                    id="minorName"
                    value={minorName}
                    onChange={(e) => setMinorName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="Child's Full Name"
                  />
                </div>
                <div>
                  <label htmlFor="minorDob" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of birth
                  </label>
                  <input
                    type="date"
                    id="minorDob"
                    value={minorDob}
                    onChange={(e) => setMinorDob(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Date: {new Date().toLocaleDateString()}
            </p>
            <button
              type="submit"
              disabled={submitting || !agreed}
              className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Signing..." : "Sign Waiver"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
