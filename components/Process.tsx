const steps = [
  {
    num: "01",
    title: "Discovery & Scoping",
    desc: "We analyse your operational requirements, compliance obligations, and procurement timelines to build a complete picture.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
        <path d="M21 21l-4.3-4.3" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Solution Blueprint",
    desc: "A detailed delivery architecture is designed - vendors identified, logistics mapped, safety compliance verified.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M3 3h7v7H3V3zM14 3h7v7h-7V3zM14 14h7v7h-7v-7zM3 14h7v7H3v-7z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Sourcing & Procurement",
    desc: "Our engineers source and inspect every component to specification, ensuring quality and authenticity at origin.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 005 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09A1.65 1.65 0 0015 4.6a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019 9c.36.13.7.34 1 .6.3.3.5.64.6 1H21a2 2 0 010 4h-.09c-.13.36-.34.7-.6 1z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Logistics & Delivery",
    desc: "Land and marine logistics coordinated end-to-end - including customs clearance, heavy haulage, and last-mile delivery to remote sites.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M1 12l5-7h7l5 7-5 7H6l-5-7z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="18" cy="12" r="3" stroke="white" strokeWidth="2" />
      </svg>
    ),
  },
  {
    num: "05",
    title: "Installation & Handover",
    desc: "On-site commissioning support, safety sign-offs, and full documentation handover - no loose ends.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Process() {
  return (
    <section id="process" className="py-20 lg:py-28">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="section-badge mb-6">
            <span className="dot" />
            Process
          </div>
          <h2 className="font-display font-bold text-4xl lg:text-6xl text-ink leading-tight mb-4">
            How We Work
          </h2>
          <p className="text-muted text-base max-w-xl mx-auto leading-relaxed">
            A proven process designed to transform complex procurement
            challenges into scalable, on-spec deliveries - efficiently and
            safely.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-line" />

          <div className="flex flex-col gap-16 md:gap-20">
            {steps.map((step, i) => (
              <div key={step.num} className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                {i % 2 === 0 ? (
                  <>
                    <div className="flex items-center gap-4 md:justify-end md:text-right">
                      <div className="md:order-2 icon-tile w-16 h-16 shrink-0 relative z-10">
                        {step.icon}
                        <span className="absolute -top-2 -right-2 bg-mist border border-line rounded-full text-xs font-mono px-2 py-0.5 text-muted">
                          {step.num}
                        </span>
                      </div>
                      <div className="md:order-1">
                        <h3 className="font-display font-semibold text-xl text-ink mb-2">
                          {step.title}
                        </h3>
                        <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                    <div className="hidden md:block" />
                  </>
                ) : (
                  <>
                    <div className="hidden md:block" />
                    <div className="flex items-center gap-4">
                      <div className="icon-tile w-16 h-16 shrink-0 relative z-10">
                        {step.icon}
                        <span className="absolute -top-2 -left-2 bg-mist border border-line rounded-full text-xs font-mono px-2 py-0.5 text-muted">
                          {step.num}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-xl text-ink mb-2">
                          {step.title}
                        </h3>
                        <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
