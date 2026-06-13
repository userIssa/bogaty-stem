const projects = [
  {
    category: "Procurement & Logistics",
    title: "Offshore Platform Resupply Programme",
    desc: "Coordinated end-to-end procurement and marine delivery of safety apparatus, valves, and instrumentation control equipment to offshore platforms across the Niger Delta.",
    metrics: [
      { value: "40+", label: "Offshore Deliveries" },
      { value: "100%", label: "On-Spec Arrival" },
      { value: "0", label: "Safety Incidents" },
    ],
  },
  {
    category: "Pipeline Coating & Painting",
    title: "Trans-Regional Pipeline Coating Initiative",
    desc: "Executed abrasive blasting and protective coating across a multi-kilometre pipeline corridor, extending asset lifespan and meeting international corrosion-resistance standards.",
    metrics: [
      { value: "Multi-km", label: "Corridor Coated" },
      { value: "ISO", label: "Standard Met" },
      { value: "+15yr", label: "Lifespan Added" },
    ],
  },
  {
    category: "General Procurement",
    title: "Industrial Catering Equipment Rollout",
    desc: "Sourced and delivered gas process equipment, pumps, and electricals for a network of industrial catering sites supporting offshore oil company personnel.",
    metrics: [
      { value: "Network", label: "Wide Rollout" },
      { value: "Full", label: "Chain of Custody" },
      { value: "On-Time", label: "Delivery" },
    ],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="section-badge mb-6">
            <span className="dot" />
            005 · Case Studies
          </div>
          <h2 className="font-display font-bold text-4xl lg:text-6xl text-ink leading-tight mb-4">
            What We&apos;ve Delivered
          </h2>
          <p className="text-muted text-base max-w-xl mx-auto leading-relaxed">
            A snapshot of engagements across procurement, logistics, and
            pipeline integrity for clients in the Nigerian energy sector.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {projects.map((p) => (
            <div key={p.title} className="bento-card p-6 lg:p-10 grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
              <div>
                <span className="section-badge mb-4">
                  <span className="dot" />
                  {p.category}
                </span>
                <h3 className="font-display font-semibold text-2xl lg:text-3xl text-ink mb-3">
                  {p.title}
                </h3>
                <p className="text-muted text-base leading-relaxed">{p.desc}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {p.metrics.map((m) => (
                  <div key={m.label} className="bg-white border border-line rounded-2xl p-4 text-center">
                    <div className="font-display font-bold text-xl lg:text-2xl text-ink mb-1">
                      {m.value}
                    </div>
                    <div className="text-muted text-[11px] uppercase tracking-wider font-mono leading-tight">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
