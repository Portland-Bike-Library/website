"use client";

import Link from "next/link";
import { organization } from "@/content/organization";
import { useLang } from "@/lib/lang";
import { translations } from "@/content/translations";

export default function Footer() {
  const { lang } = useLang();
  const t = translations[lang];
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3">{organization.name}</h3>
            <p className="text-gray-400 text-sm">{t.org.mission}</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">{t.footer.quickLinks}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t.footer.aboutUs}
                </Link>
              </li>
              <li>
                <Link href="/inventory" className="hover:text-white transition-colors">
                  {t.footer.browseBikes}
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-white transition-colors">
                  {t.footer.safetyResources}
                </Link>
              </li>
              <li>
                <Link href="/waiver" className="hover:text-white transition-colors">
                  {t.footer.signWaiver}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">{t.footer.contact}</h3>
            <p className="text-gray-400 text-sm">
              {t.footer.location}
            </p>
            <p className="text-gray-400 text-sm">
              {t.footer.area}
            </p>
            <a
              href={`mailto:${organization.contact.email}`}
              className="text-green-400 hover:text-green-300 transition-colors text-sm"
            >
              {organization.contact.email}
            </a>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} {organization.name}. {t.footer.legal}</p>
        </div>
      </div>
    </footer>
  );
}
