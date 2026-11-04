"use client";

import { organization, board, programs } from "@/content/organization";
import { useLang } from "@/lib/lang";
import { translations } from "@/content/translations";

export default function AboutPage() {
  const { lang } = useLang();
  const t = translations[lang];
  const a = t.about;
  return (
    <div className="py-12">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">{a.title}</h1>
        <p className="text-xl text-gray-600">{t.org.purpose}</p>
      </section>

      {/* Mission & Vision */}
      <section className="bg-green-50 py-12 mb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{a.ourMission}</h2>
              <p className="text-gray-600">{t.org.mission}</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{a.ourVision}</h2>
              <p className="text-gray-600 italic">&quot;{t.org.vision}&quot;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">{a.board}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {board.map((member, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-green-600">
                  {member.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
              {member.roles.length > 0 && (
                <p className="text-green-600 font-medium">
                  {member.roles.map((r) => t.org.roles[r] ?? r).join(", ")}
                </p>
              )}
              <a
                href={`mailto:${member.email}`}
                className="text-sm text-gray-500 hover:text-green-600 transition-colors"
              >
                {member.email}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Our Programs */}
      <section className="bg-gray-50 py-12 mb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">{a.ourPrograms}</h2>
          <div className="space-y-8">
            {t.org.programs.map((program, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{programs[index].icon}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 mb-2">{program.description}</p>
                    <p className="text-green-600 font-medium">
                      <strong>{a.goal}</strong> {program.goal}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Status */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{a.legalTitle}</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 mb-4">{a.legal1}</p>
          <p className="text-gray-600">{a.legal2}</p>
        </div>
      </section>

      {/* How to Support */}
      <section className="bg-green-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">{a.supportTitle}</h2>
          <p className="text-lg mb-8">{a.supportBody}</p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-green-600 p-6 rounded-lg">
              <h3 className="font-semibold text-xl mb-2">{a.donateTitle}</h3>
              <p className="text-green-100">{a.donateBody}</p>
            </div>
            <div className="bg-green-600 p-6 rounded-lg">
              <h3 className="font-semibold text-xl mb-2">{a.financialTitle}</h3>
              <p className="text-green-100">{a.financialBody}</p>
            </div>
            <div className="bg-green-600 p-6 rounded-lg">
              <h3 className="font-semibold text-xl mb-2">{a.volunteerTitle}</h3>
              <p className="text-green-100">{a.volunteerBody}</p>
            </div>
          </div>
          <p className="mt-8">
            {a.contactBefore}
            <a
              href={`mailto:${organization.contact.email}`}
              className="underline hover:text-green-200"
            >
              {organization.contact.email}
            </a>
            {a.contactAfter}
          </p>
        </div>
      </section>
    </div>
  );
}
