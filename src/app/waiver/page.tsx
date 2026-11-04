"use client";

import Link from "next/link";
import WaiverText from "@/components/WaiverText";
import { useLang } from "@/lib/lang";
import { translations } from "@/content/translations";

export default function WaiverPage() {
  const { lang } = useLang();
  const t = translations[lang].waiverPage;
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-sm text-blue-800">
          {t.referenceBefore}
          <Link href="/inventory" className="underline font-medium">
            {t.referenceLink}
          </Link>
          {t.referenceAfter}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <WaiverText showMinorNotice />
        </div>

        <div className="text-center">
          <Link
            href="/inventory"
            className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors inline-block"
          >
            {t.browseAndReserve}
          </Link>
        </div>
      </div>
    </div>
  );
}
