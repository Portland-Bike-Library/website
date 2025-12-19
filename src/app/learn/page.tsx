"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function LearnPage() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState("");

  const handleCompleteVideo = async () => {
    setError("");
    setCompleting(true);

    try {
      const res = await fetch("/api/video/complete", {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        await refreshUser();
        router.push("/account");
      } else {
        setError(data.error || "Failed to mark video as complete");
      }
    } catch {
      setError("An unexpected error occurred");
    }

    setCompleting(false);
  };

  // Determine user status for the video requirement banner
  const needsWaiver = user && !user.hasSignedWaiver;
  const needsVideo = user && user.hasSignedWaiver && !user.hasWatchedVideo;
  const completed = user && user.hasSignedWaiver && user.hasWatchedVideo;

  return (
    <div className="py-12">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Learn to Ride Safely</h1>
        <p className="text-lg text-gray-600">
          Before borrowing a bike, please review our safety materials. This helps keep
          you, your family, and our community safe.
        </p>
      </section>

      {/* Status Banner */}
      {!loading && user && (
        <section className="max-w-4xl mx-auto px-4 mb-8">
          {needsWaiver && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                <strong>Step 1:</strong> Please{" "}
                <Link href="/waiver" className="underline font-medium">
                  sign the waiver
                </Link>{" "}
                first, then return here to watch the safety video.
              </p>
            </div>
          )}
          {needsVideo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                <strong>Step 2:</strong> Watch the safety video below and click
                &quot;Complete Video&quot; when finished.
              </p>
            </div>
          )}
          {completed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <span className="text-2xl">&#9989;</span>
              <p className="text-green-800">
                <strong>All done!</strong> You&apos;ve completed the safety video on{" "}
                {user.videoWatchedAt
                  ? new Date(user.videoWatchedAt).toLocaleDateString()
                  : "record"}
                . You&apos;re ready to borrow bikes!
              </p>
            </div>
          )}
        </section>
      )}

      {/* Video Section */}
      <section className="max-w-4xl mx-auto px-4 mb-8">
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
          <div className="aspect-video flex items-center justify-center bg-gray-800">
            {/* Placeholder for video - replace with actual video embed */}
            <div className="text-center text-white p-8">
              <div className="text-6xl mb-4">&#127909;</div>
              <p className="text-xl font-semibold mb-2">Safety Orientation Video</p>
              <p className="text-gray-400 mb-4">
                Video coming soon! In the meantime, please review the safety tips below.
              </p>
              <p className="text-sm text-gray-500">
                (Replace this placeholder with your YouTube/Vimeo embed)
              </p>
            </div>
          </div>
        </div>

        {/* Complete Video Button */}
        {!loading && needsVideo && (
          <div className="mt-6 text-center">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 max-w-md mx-auto">
                {error}
              </div>
            )}
            <button
              onClick={handleCompleteVideo}
              disabled={completing}
              className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {completing ? "Completing..." : "I've Watched the Video - Complete"}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Click this button after watching the full video
            </p>
          </div>
        )}

        {!loading && !user && (
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4">
              Create an account and sign the waiver to track your video completion.
            </p>
            <Link
              href="/auth/signup"
              className="bg-green-700 text-white px-6 py-2 rounded-full font-medium hover:bg-green-600 transition-colors"
            >
              Get Started
            </Link>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-4 text-center">
          This video covers essential bike safety, traffic rules, and how to care for your borrowed bike.
        </p>
      </section>

      {/* Safety Tips */}
      <section className="bg-gray-50 py-12 mb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Essential Safety Tips
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">&#9937;</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Always Wear a Helmet
              </h3>
              <p className="text-gray-600">
                Oregon law requires helmets for riders under 16, but we strongly recommend
                all riders wear an approved bicycle helmet. It&apos;s the single most effective
                way to prevent head injuries.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">&#128678;</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Follow Traffic Laws
              </h3>
              <p className="text-gray-600">
                Bicycles must follow the same rules as cars in Oregon. Stop at stop signs
                and red lights, signal your turns, and ride with traffic, not against it.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">&#128161;</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Be Visible
              </h3>
              <p className="text-gray-600">
                Wear bright colors during the day. At night, use front and rear lights
                and reflective gear. Make eye contact with drivers at intersections.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">&#128270;</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Pre-Ride Check
              </h3>
              <p className="text-gray-600">
                Before each ride, check your brakes, tires, and chain. Make sure the seat
                is at the right height and everything feels secure.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">&#128101;</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Ride Predictably
              </h3>
              <p className="text-gray-600">
                Ride in a straight line, don&apos;t weave between parked cars, and always
                signal your intentions. Be predictable so drivers know what to expect.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">&#128679;</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Watch for Hazards
              </h3>
              <p className="text-gray-600">
                Look out for potholes, railroad tracks, wet leaves, and car doors opening.
                Keep a safe distance from parked cars (the &quot;door zone&quot;).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABC Quick Check */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          The ABC Quick Check
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Before every ride, do a quick safety check. Remember: A-B-C!
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <div className="text-5xl font-bold text-green-600 mb-4">A</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Air</h3>
            <p className="text-gray-600">
              Check tire pressure. Tires should be firm but have a little give.
              Look for damage or excessive wear.
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <div className="text-5xl font-bold text-green-600 mb-4">B</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Brakes</h3>
            <p className="text-gray-600">
              Test both brakes. They should stop the wheel without the lever
              touching the handlebar.
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <div className="text-5xl font-bold text-green-600 mb-4">C</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Chain</h3>
            <p className="text-gray-600">
              Check that the chain is clean and lubricated. It shouldn&apos;t be
              rusty or skip when pedaling.
            </p>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="bg-gray-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Additional Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <a
              href="https://www.oregon.gov/odot/safety/pages/bicyclist.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">Oregon Bicyclist Manual</h3>
              <p className="text-gray-300">
                Official guide to Oregon bicycle laws and safe riding practices.
              </p>
            </a>
            <a
              href="https://www.portlandoregon.gov/transportation/34772"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">Portland Bike Maps</h3>
              <p className="text-gray-300">
                Find bike lanes, paths, and recommended routes in Portland.
              </p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
