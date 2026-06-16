"use client";
import { useState } from "react";
import Image from "next/image";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", company: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="cta-card p-8 lg:p-16 text-center relative overflow-hidden">
          {/* Glow */}
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[300px] opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, #C8962A 0%, transparent 70%)" }}
          />

          <div className="relative">
            <div className="flex items-center justify-center mb-6">
              <Image src="/logos/bogaty-stem-white.png" alt="Bogaty STEM" width={220} height={60} className="object-contain h-12 w-auto" />
            </div>

            <h2 className="font-display font-bold text-3xl lg:text-5xl text-white leading-tight mb-4 max-w-xl mx-auto">
              Your Next Project Deserves Precision Engineering.
            </h2>
            <p className="text-white/60 text-base max-w-md mx-auto mb-10">
              Tell us about your procurement, logistics, or pipeline integrity
              needs and our team will respond within one business day.
            </p>

            {submitted ? (
              <div className="bg-white/10 border border-white/10 rounded-3xl p-10 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center mx-auto mb-4">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10l4 4 8-8" stroke="#C8962A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-display font-semibold text-xl text-white mb-2">Request Sent</h3>
                <p className="text-white/60 text-sm">We&apos;ll be in touch within one business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-lg mx-auto">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full bg-white/10 border border-white/10 rounded-full px-5 py-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold transition-colors"
                  />
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Your company name"
                    className="w-full bg-white/10 border border-white/10 rounded-full px-5 py-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your business email*"
                  className="w-full bg-white/10 border border-white/10 rounded-full px-5 py-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold transition-colors"
                />
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Message"
                  className="w-full bg-white/10 border border-white/10 rounded-3xl px-5 py-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold transition-colors resize-none"
                />
                {error && (
                  <p className="text-sm text-red-300 -mt-1">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white hover:bg-mist transition-colors text-ink font-display font-semibold text-sm px-8 py-3.5 rounded-full mx-auto mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Your Request!"}
                </button>
              </form>
            )}

            {/* Social links */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-12 pt-8 border-t border-white/10">
              {[
                { name: "LinkedIn", href: "#" },
                { name: "Instagram", href: "https://www.instagram.com/bogatystem" },
                { name: "Facebook", href: "#" },
                { name: "Twitter X", href: "#" },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target={s.href !== "#" ? "_blank" : undefined}
                  rel={s.href !== "#" ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors text-white/80 text-sm px-4 py-2 rounded-full"
                >
                  {s.name}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 8L8 2M8 2H3M8 2v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 mt-10 text-sm text-muted">
          {["About", "Values", "Services", "Process", "Projects", "Testimonials", "FAQs"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-ink transition-colors">
              {l}
            </a>
          ))}
        </div>
        <div className="text-center mt-6 text-xs text-muted font-mono">
          © {new Date().getFullYear()} Bogaty STEM - A subsidiary of Bogaty Centrum Limited
        </div>
      </div>
    </section>
  );
}
