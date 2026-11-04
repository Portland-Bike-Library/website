"use client";

import { waiverContent, waiverContentEs } from "@/content/waiver";
import { useLang } from "@/lib/lang";
import { translations } from "@/content/translations";

type Content = typeof waiverContent;

function Body({ c, compact }: { c: Content; compact?: boolean }) {
  return (
    <>
      <p className={`text-gray-700 font-medium ${compact ? "mb-4" : "mb-6"}`}>{c.introduction}</p>
      <ol className={`${compact ? "space-y-3 mb-6" : "space-y-4 mb-8"}`}>
        {c.clauses.map((clause) => (
          <li key={clause.number} className="text-gray-700 leading-relaxed">
            <span className="font-semibold text-green-700">{clause.number}.</span>{" "}
            {clause.text}
          </li>
        ))}
      </ol>
      <div className={`bg-gray-50 p-4 rounded-lg ${compact ? "mb-6" : "mb-4"}`}>
        <p className={`text-gray-700 ${compact ? "text-sm" : "font-medium"}`}>{c.acknowledgment}</p>
      </div>
    </>
  );
}

/**
 * Renders the waiver. In Spanish, shows the courtesy translation first with a
 * note, then the binding English text. English text always appears.
 */
export default function WaiverText({ compact = false, showMinorNotice = false }: { compact?: boolean; showMinorNotice?: boolean }) {
  const { lang } = useLang();
  const t = translations[lang].waiverPage;
  const c = lang === "es" ? waiverContentEs : waiverContent;

  return (
    <>
      <h2 className={`font-semibold text-gray-800 mb-2 ${compact ? "text-xl" : "text-2xl"}`}>{c.title}</h2>
      <p className="text-sm text-gray-600 mb-6">{c.subtitle}</p>

      {lang === "es" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-sm text-amber-900">
          {t.courtesyNote}
        </div>
      )}

      <Body c={c} compact={compact} />
      {showMinorNotice && <p className="text-sm text-gray-600">{c.minorNotice}</p>}

      {lang === "es" && (
        <details className="mt-6 border-t border-gray-200 pt-4">
          <summary className="cursor-pointer font-semibold text-gray-800">
            {t.bindingLabel}: {waiverContent.title}
          </summary>
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-4">{waiverContent.subtitle}</p>
            <Body c={waiverContent} compact />
          </div>
        </details>
      )}
    </>
  );
}
