"use client";
import { useState } from "react";

const faqs = [
  {
    q: "What regions do you operate in?",
    a: "We primarily serve the Niger Delta and broader Nigerian energy sector, with capability to coordinate offshore deliveries to platforms and onshore sites nationwide.",
  },
  {
    q: "Can you handle full procurement-to-installation projects?",
    a: "Yes. Our scope covers sourcing, quality inspection, land and marine logistics, and on-site installation support - with full documentation handover at completion.",
  },
  {
    q: "How do you manage offshore logistics and customs clearance?",
    a: "We coordinate marine freight, customs clearance, and last-mile delivery in-house through established partnerships with licensed logistics operators across Nigerian ports.",
  },
  {
    q: "Do you offer pipeline coating for existing infrastructure, or only new builds?",
    a: "Both. Our abrasive blasting and coating teams work on new pipeline sections as well as rehabilitation and re-coating of existing infrastructure.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="section-badge mb-6 mx-auto">
            <span className="dot" />
            FAQs
          </div>
          <h2 className="font-display font-bold text-4xl lg:text-6xl text-ink leading-tight">
            Common Questions
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((f, i) => (
            <div key={i} className={`faq-row p-5 lg:p-6 ${open === i ? "open" : ""}`}>
              <button
                className="w-full flex items-center justify-between gap-6 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-muted bg-white border border-line rounded-full w-7 h-7 flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="font-display font-medium text-ink text-base lg:text-lg">
                    {f.q}
                  </span>
                </div>
                <span className="faq-plus">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <div className={`faq-answer ${open === i ? "open" : ""}`}>
                <p className="text-muted text-sm leading-relaxed pt-4 pl-11 pr-12">
                  {f.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <span className="text-muted text-sm">Have any other questions? </span>
          <a href="#contact" className="inline-flex items-center gap-2 font-display font-medium text-ink hover:text-gold transition-colors">
            Contact Us
            <span className="w-6 h-6 rounded-full bg-mist border border-line flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
