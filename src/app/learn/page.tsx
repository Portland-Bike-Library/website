"use client";

import Link from "next/link";
import SafetyVideos from "@/components/SafetyVideos";
import { useLang } from "@/lib/lang";
import { translations } from "@/content/translations";

export default function LearnPage() {
  const { lang } = useLang();
  const t = translations[lang].learn;
  return (
    <div className="py-12">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{t.title}</h1>
        <p className="text-lg text-gray-600">{t.intro}</p>
      </section>

      {/* Video Section */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <SafetyVideos />
      </section>

      {/* E-bike basics */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">{t.ebikeTitle}</h2>
        <p className="text-gray-600 text-center mb-8">{t.ebikeIntro}</p>
        <div className="grid md:grid-cols-2 gap-6">
          {t.ebike.map((card) => (
            <div key={card.title} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Safety Tips */}
      <section className="bg-gray-50 py-12 mb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{t.tipsTitle}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {t.tips.map((tip) => (
              <div key={tip.title} className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl mb-3">{tip.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{tip.title}</h3>
                <p className="text-gray-600">{tip.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABC Quick Check */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">{t.abcTitle}</h2>
        <p className="text-gray-600 text-center mb-8">{t.abcIntro}</p>
        <div className="grid md:grid-cols-3 gap-6">
          {t.abc.map((item) => (
            <div key={item.letter} className="bg-green-50 p-6 rounded-lg text-center">
              <div className="text-5xl font-bold text-green-600 mb-4">{item.letter}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <div className="bg-green-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">{t.readyTitle}</h2>
          <p className="text-gray-600 mb-6">{t.readyBody}</p>
          <Link
            href="/inventory"
            className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors inline-block"
          >
            {t.browseBikes}
          </Link>
        </div>
      </section>

      {/* Resources */}
      <section className="bg-gray-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">{t.resourcesTitle}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <a
              href="https://www.oregon.gov/odot/safety/pages/bicyclist.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">{t.oregonTitle}</h3>
              <p className="text-gray-300">{t.oregonBody}</p>
            </a>
            <a
              href="https://www.portlandoregon.gov/transportation/34772"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">{t.mapsTitle}</h3>
              <p className="text-gray-300">{t.mapsBody}</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
