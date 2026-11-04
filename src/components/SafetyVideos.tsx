"use client";

import { useState } from "react";
import { safetyVideos } from "@/content/safety-videos";

type Lang = "en" | "es";

function Player({ id, title }: { id: string; title: string }) {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
      <iframe
        className="aspect-video w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}


export default function SafetyVideos() {
  const [lang, setLang] = useState<Lang>("en");
  const [main, ...rest] = safetyVideos;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-gray-800">
          {lang === "en" ? "Safety Orientation Video" : "Video de Orientación de Seguridad"}
        </h2>
        <div className="inline-flex rounded-full border border-gray-300 overflow-hidden text-sm">
          {(["en", "es"] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`px-3 py-1 font-medium transition-colors ${
                lang === l ? "bg-green-700 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {l === "en" ? "English" : "Español"}
            </button>
          ))}
        </div>
      </div>

      <Player id={main.youtubeId[lang]} title={main.title[lang]} />
      <p className="text-sm text-gray-600 mt-3">{main.blurb[lang]}</p>

      {rest.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {rest.map((v) => (
            <div key={v.key}>
              <Player id={v.youtubeId[lang]} title={v.title[lang]} />
              <h3 className="font-semibold text-gray-800 mt-3">{v.title[lang]}</h3>
              <p className="text-sm text-gray-600 mt-1">{v.blurb[lang]}</p>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-6 text-center">
        Videos courtesy of the{" "}
        <a
          href="https://bikeleague.org/ridesmart/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-700"
        >
          League of American Bicyclists
        </a>{" "}
        Ride Smart series.
      </p>
    </div>
  );
}
