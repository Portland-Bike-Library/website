"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">
            Please sign in to view your account.
          </p>
          <Link
            href="/auth/signin"
            className="bg-green-700 text-white px-6 py-2 rounded-full font-medium hover:bg-green-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Account</h1>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg text-gray-800">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg text-gray-800">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="text-lg text-gray-800">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Registration Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Registration Status</h2>

          {/* Overall Status */}
          {user.hasSignedWaiver && user.hasWatchedVideo ? (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">✅</span>
                <div>
                  <p className="text-green-800 font-semibold text-lg">Ready to Borrow!</p>
                  <p className="text-green-700 text-sm">
                    You&apos;ve completed all requirements and can now borrow bikes.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⚠️</span>
                <div>
                  <p className="text-yellow-800 font-semibold text-lg">Registration Incomplete</p>
                  <p className="text-yellow-700 text-sm">
                    Please complete the steps below to borrow bikes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Steps */}
          <div className="space-y-3">
            {/* Step 1: Waiver */}
            <div className={`p-4 rounded-lg ${user.hasSignedWaiver ? "bg-green-50" : "bg-gray-50"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {user.hasSignedWaiver ? "✅" : "⚪"}
                  </span>
                  <div>
                    <p className={`font-medium ${user.hasSignedWaiver ? "text-green-800" : "text-gray-800"}`}>
                      Step 1: Sign Waiver
                    </p>
                    {user.hasSignedWaiver && (
                      <p className="text-green-700 text-sm">
                        Signed on {user.waiverSignedAt ? new Date(user.waiverSignedAt).toLocaleDateString() : "record"}
                        {" "}&bull; <span className="font-serif italic">{user.waiverSignature}</span>
                      </p>
                    )}
                  </div>
                </div>
                {!user.hasSignedWaiver && (
                  <Link
                    href="/waiver"
                    className="bg-green-700 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    Sign Now
                  </Link>
                )}
              </div>
            </div>

            {/* Step 2: Video */}
            <div className={`p-4 rounded-lg ${user.hasWatchedVideo ? "bg-green-50" : "bg-gray-50"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {user.hasWatchedVideo ? "✅" : "⚪"}
                  </span>
                  <div>
                    <p className={`font-medium ${user.hasWatchedVideo ? "text-green-800" : "text-gray-800"}`}>
                      Step 2: Watch Safety Video
                    </p>
                    {user.hasWatchedVideo && (
                      <p className="text-green-700 text-sm">
                        Completed on {user.videoWatchedAt ? new Date(user.videoWatchedAt).toLocaleDateString() : "record"}
                      </p>
                    )}
                    {!user.hasSignedWaiver && !user.hasWatchedVideo && (
                      <p className="text-gray-500 text-sm">Complete Step 1 first</p>
                    )}
                  </div>
                </div>
                {user.hasSignedWaiver && !user.hasWatchedVideo && (
                  <Link
                    href="/learn"
                    className="bg-green-700 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    Watch Now
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/inventory"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl">🚲</span>
              <div>
                <p className="font-medium text-gray-800">Browse Bikes</p>
                <p className="text-sm text-gray-500">See available bikes</p>
              </div>
            </Link>
            <Link
              href="/learn"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl">🎥</span>
              <div>
                <p className="font-medium text-gray-800">Safety Resources</p>
                <p className="text-sm text-gray-500">Watch safety video</p>
              </div>
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl">👥</span>
              <div>
                <p className="font-medium text-gray-800">About Us</p>
                <p className="text-sm text-gray-500">Learn about our mission</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Sign Out */}
        <div className="text-center">
          <button
            onClick={handleSignOut}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
