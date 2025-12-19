import Link from "next/link";
import { organization } from "@/content/organization";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3">{organization.name}</h3>
            <p className="text-gray-400 text-sm">{organization.mission}</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/inventory" className="hover:text-white transition-colors">
                  Browse Bikes
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-white transition-colors">
                  Safety Resources
                </Link>
              </li>
              <li>
                <Link href="/waiver" className="hover:text-white transition-colors">
                  Sign Waiver
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Contact</h3>
            <p className="text-gray-400 text-sm">
              {organization.contact.location}
            </p>
            <p className="text-gray-400 text-sm">
              {organization.contact.area}
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
          <p>&copy; {new Date().getFullYear()} {organization.name}. A 501(c)(3) nonprofit organization.</p>
        </div>
      </div>
    </footer>
  );
}
