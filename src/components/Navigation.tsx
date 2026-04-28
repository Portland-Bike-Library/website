"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/inventory", label: "Bikes" },
  { href: "/learn", label: "Learn" },
  { href: "/waiver", label: "Waiver" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">&#128690;</span>
            <span className="font-bold text-xl">Portland Bike Library</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:text-green-200 transition-colors ${
                  pathname === item.href ? "text-green-200 font-semibold" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/inventory"
              className="bg-white text-green-700 px-4 py-1 rounded-full hover:bg-green-100 transition-colors font-medium"
            >
              Reserve a Bike
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-2 hover:text-green-200 ${
                  pathname === item.href ? "text-green-200 font-semibold" : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/inventory"
              className="block py-2 hover:text-green-200 font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Reserve a Bike
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
