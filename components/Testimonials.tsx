const testimonials = [
  {
    quote:
      "Bogaty STEM coordinated our offshore resupply with a level of precision we hadn't experienced from a local vendor before. Every consignment arrived to spec and on schedule.",
    name: "Procurement Lead",
    role: "Offshore Operations, Niger Delta",
  },
  {
    quote:
      "Their pipeline coating team understood the corrosion challenges of our environment immediately. The finish quality has held up well beyond our expectations.",
    name: "Independent E&P Operator",
    role: "Asset Integrity Manager",
  },
  {
    quote:
      "What stood out was the logistics coordination — heavy equipment moved through difficult terrain without a single delay to our installation timeline.",
    name: "Site Operations Director",
    role: "Industrial Catering Network",
  },
  {
    quote:
      "An indigenous firm that operates with the discipline of an international contractor. Documentation, safety sign-off, everything was in order.",
    name: "HSE Coordinator",
    role: "Marine Logistics Partner",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="section-badge mb-6">
            <span className="dot" />
            Testimonial
          </div>
          <h2 className="font-display font-bold text-4xl lg:text-6xl text-ink leading-tight mb-4">
            What They&apos;re Saying
          </h2>
          <p className="text-muted text-base max-w-xl mx-auto leading-relaxed">
            Trusted across procurement, logistics, and pipeline integrity
            engagements in the Nigerian energy sector.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bento-card p-8 flex flex-col justify-between min-h-[220px] relative"
            >
              <span className="absolute top-6 right-6 text-4xl text-line font-display select-none">
                &rdquo;
              </span>
              <p className="text-ink text-base leading-relaxed pr-8 mb-8">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-charcoal flex items-center justify-center shrink-0">
                  <span className="font-mono text-xs text-white">
                    {t.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-display font-medium text-sm text-ink">{t.name}</div>
                  <div className="font-mono text-xs text-muted">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
