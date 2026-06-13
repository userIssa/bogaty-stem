const values = [
  {
    num: "01",
    title: "Client-First Approach",
    desc: "Every solution is engineered around your operational goals, timelines, and safety requirements.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l2.4 6.8L21 11l-6.6 2.2L12 20l-2.4-6.8L3 11l6.6-2.2L12 2z" fill="white" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "End-to-End Capability",
    desc: "From procurement through installation, we handle every stage of the supply chain in-house.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M5 19l14-14M19 5h-6M19 5v6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Indigenous Excellence",
    desc: "A proudly Nigerian firm setting new industrial standards for the domestic energy sector.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="8" height="8" rx="2" fill="white" />
        <rect x="13" y="3" width="8" height="8" rx="2" fill="white" fillOpacity="0.4" />
        <rect x="3" y="13" width="8" height="8" rx="2" fill="white" fillOpacity="0.4" />
        <rect x="13" y="13" width="8" height="8" rx="2" fill="white" />
      </svg>
    ),
  },
];

export default function Values() {
  return (
    <section id="values" className="py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="section-badge mb-6">
            <span className="dot" />
            002 · Values
          </div>
          <h2 className="font-display font-bold text-4xl lg:text-6xl text-ink leading-tight mb-4">
            Why Choose Us?
          </h2>
          <p className="text-muted text-base max-w-xl mx-auto leading-relaxed">
            As an indigenous Nigerian firm, we bring deep local knowledge
            paired with international-standard execution to every offshore
            and onshore engagement.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div key={v.num}>
              <div className="value-card aspect-square flex items-center justify-center mb-6 relative">
                <div className="icon-orb w-20 h-20 flex items-center justify-center relative z-10">
                  {v.icon}
                </div>
                <span className="absolute bottom-5 left-5 font-mono text-xs text-white/70 bg-white/10 rounded-full px-3 py-1 z-10">
                  {v.num}
                </span>
              </div>
              <h3 className="font-display font-semibold text-xl text-ink mb-2">
                {v.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
