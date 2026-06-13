"use client";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "About", href: "#about" },
    { label: "Values", href: "#values" },
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "Projects", href: "#projects" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQs", href: "#faq" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4">
      <div className="pill-nav flex items-center justify-between px-2 py-2">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 pl-2 pr-2">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 p-1.5">
            <Image src="/logos/icon-gold.png" alt="Bogaty STEM" width={28} height={28} className="object-contain w-full h-full" />
          </div>
          <span className="font-display font-semibold text-white text-sm tracking-wide whitespace-nowrap">
            Bogaty STEM
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-6 px-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-white/70 hover:text-white text-sm transition-colors whitespace-nowrap"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#contact"
          className="hidden sm:inline-flex items-center gap-2 bg-white hover:bg-mist transition-colors text-ink font-medium text-sm px-4 py-2 rounded-full whitespace-nowrap"
        >
          Work with Us
        </a>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors text-white text-sm px-4 py-2 rounded-full"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 3.5h12M1 7h12M1 10.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Menu
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden mt-2 bg-charcoal rounded-3xl px-6 py-5 flex flex-col gap-4 shadow-xl">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="bg-white text-ink font-medium text-sm px-4 py-2.5 rounded-full text-center mt-1"
          >
            Work with Us
          </a>
        </div>
      )}
    </nav>
  );
}
