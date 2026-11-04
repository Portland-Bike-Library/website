"use client";

import { useLang, type Lang } from "@/lib/lang";

export default function LangSwitch({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div
      className={`inline-flex rounded-full border overflow-hidden text-sm ${
        dark ? "border-green-300" : "border-gray-300"
      }`}
      role="group"
      aria-label="Language"
    >
      {(["en", "es"] as Lang[]).map((l) => {
        const active = lang === l;
        const cls = dark
          ? active
            ? "bg-white text-green-700"
            : "text-white hover:bg-green-600"
          : active
            ? "bg-green-700 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100";
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={active}
            className={`px-3 py-1 font-medium transition-colors ${cls}`}
          >
            {l === "en" ? "English" : "Español"}
          </button>
        );
      })}
    </div>
  );
}
