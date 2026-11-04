"use client";

import { safetyVideos } from "@/content/safety-videos";
import { useLang } from "@/lib/lang";
import { translations } from "@/content/translations";

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
  const { lang } = useLang();
  const t = translations[lang].learn;
  const [main, ...rest] = safetyVideos;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-3">{t.videoHeading}</h2>

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
        {t.courtesyBefore}
        <a
          href="https://bikeleague.org/ridesmart/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-700"
        >
          {t.courtesyLink}
        </a>
        {t.courtesyAfter}
      </p>
    </div>
  );
}
