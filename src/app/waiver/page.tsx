import Link from "next/link";
import { waiverContent } from "@/content/waiver";

export default function WaiverPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{waiverContent.title}</h1>
        <p className="text-lg text-gray-600 mb-8">{waiverContent.subtitle}</p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-sm text-blue-800">
          This page is for reference. You&apos;ll sign the waiver as part of the
          reservation form when you{" "}
          <Link href="/inventory" className="underline font-medium">
            reserve a bike
          </Link>
          .
        </div>

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

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-gray-700 font-medium">{waiverContent.acknowledgment}</p>
          </div>

          <p className="text-sm text-gray-600">{waiverContent.minorNotice}</p>
        </div>

        <div className="text-center">
          <Link
            href="/inventory"
            className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors inline-block"
          >
            Browse Bikes &amp; Reserve
          </Link>
        </div>
      </div>
    </div>
  );
}
