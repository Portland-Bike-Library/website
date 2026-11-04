"use client";

import { useLang } from "@/lib/lang";
import { translations } from "@/content/translations";

export default function ComingSoonBanner() {
  const { lang } = useLang();
  return (
    <div className="bg-yellow-500 text-black text-center py-2 font-semibold">
      {translations[lang].nav.comingSoon}
    </div>
  );
}
