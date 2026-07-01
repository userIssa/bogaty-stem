"use client";

import { useState } from "react";

function ChatIllustration() {
  return (
    <div className="bento-card p-6 flex flex-col gap-3 justify-center min-h-[180px]">
      <div className="flex items-center gap-2">
        <div className="icon-tile w-9 h-9 shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="4" fill="white" />
          </svg>
        </div>
        <div className="bg-white border border-line rounded-2xl rounded-bl-sm px-3 py-2">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-line" />
            <span className="w-1.5 h-1.5 rounded-full bg-line" />
            <span className="w-1.5 h-1.5 rounded-full bg-line" />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="bg-charcoal text-white text-xs rounded-2xl rounded-br-sm px-3 py-2 max-w-[75%]">
          Can you confirm delivery timelines?
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="icon-tile w-9 h-9 shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="4" fill="white" />
          </svg>
        </div>
        <div className="bg-white border border-line rounded-2xl rounded-bl-sm px-3 py-2 text-xs text-ink">
          Good day - yes, dispatch is on schedule.
        </div>
      </div>
    </div>
  );
}

function ChartIllustration() {
  const points = "0,38 12,30 24,34 36,18 48,26 60,12 72,22 84,8 96,16 108,4 120,10";
  return (
    <div className="bento-card p-6 flex flex-col justify-between min-h-[180px]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted uppercase tracking-wider">Deliveries Tracked</span>
        <span className="text-xs font-mono text-ink bg-white border border-line rounded-full px-2 py-1">200+</span>
      </div>
      <svg viewBox="0 0 120 44" className="w-full h-16 mt-4" preserveAspectRatio="none">
        <polyline points={points} fill="none" stroke="#C8962A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="120" cy="10" r="3" fill="#C8962A" />
      </svg>
    </div>
  );
}

function OrgDiagram() {
  const icons = [
    // Land Logistics (Truck)
    <g key="truck" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </g>,
    // Marine Logistics (Cargo Ship)
    <g key="ship" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 17h20L19 7H5L2 17z" />
      <path d="M5 7V3h3v4" />
      <path d="M9 7V3h3v4" />
      <path d="M13 7V3h3v4" />
    </g>,
    // Package/Logistics (Box)
    <g key="package" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5M2 7v10M22 7v10M12 12v10" />
    </g>
  ];
  return (
    <div className="bento-card p-6 flex flex-col items-center justify-center gap-4 min-h-[180px]">
      <div className="icon-tile w-11 h-11 shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <g stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </g>
        </svg>
      </div>
      <div className="w-px h-5 bg-line shrink-0" />
      <div className="flex gap-3">
        {icons.map((icon, i) => (
          <div key={i} className="icon-tile w-10 h-10 shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">{icon}</svg>
          </div>
        ))}
      </div>
    </div>
  );
}

const CATEGORIES = [
  {
    id: "safety",
    label: "Safety Apparatus",
    title: "Safety Apparatus",
    body: "PPE, Firefighting Equipment, Emergency Response Kits, Gas Detection & Monitoring Systems",
  },
  {
    id: "valves",
    label: "Valves",
    title: "Valves",
    body: "Ball, Gate & Globe Valves, Pressure Relief Valves, Check and Butterfly Valves, Actuated Control Valves",
  },
  {
    id: "instrumentation",
    label: "Instrumentation Control",
    title: "Instrumentation Control",
    body: "Flow, Pressure & Temperature Sensors, Control Panels and Automation Systems, Process Monitoring Instruments, Industrial Calibration Equipment",
  },
  {
    id: "gas-process",
    label: "Gas Process Equipment",
    title: "Gas Process Equipment",
    body: "Gas Compressors & Separators, Filtration & Treatment Systems, Gas Dehydration Units, Measurement & Flow Control Devices",
  },
  {
    id: "pumps",
    label: "Pumps",
    title: "Pumps",
    body: "Centrifugal & Reciprocating Pumps, Submersible & Multistage Pumps, Chemical Injection Pumps, High-Pressure Pumping Systems",
  },
  {
    id: "electrical",
    label: "Electrical Solutions",
    title: "Electrical Solutions",
    body: "Industrial Power Generators, Electrical Panels & Switchgear, Cables, Transformers & Circuit Breakers, Lighting & Explosion-Proof Fixtures",
  },
];

export default function Services() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <section id="services" className="py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="section-badge mb-6">
            <span className="dot" />
            Capabilities
          </div>
          <h2 className="font-display font-bold text-4xl lg:text-6xl text-ink leading-tight mb-4">
            Our STEM-Driven Services
          </h2>
          <p className="text-muted text-base max-w-xl mx-auto leading-relaxed">
            A comprehensive range of services tailored to the diverse needs
            of clients in the oil and gas industry.
          </p>
        </div>

        <div className="bento-card p-6 lg:p-8 mb-6">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="font-display font-semibold text-2xl text-ink mb-3">
                General Procurement
              </h3>
              <p className="text-muted text-base leading-relaxed">
                A wide array of critical components sourced and delivered to
                specification - safety apparatus, valves, instrumentation
                control, gas process equipment, pumps, and electricals.
              </p>
            </div>
            <ChatIllustration />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6 items-stretch">
          <div className="bento-card p-6 lg:p-8 flex flex-col">
            <h3 className="font-display font-semibold text-2xl text-ink mb-3">
              Pipeline Coating &amp; Painting
            </h3>
            <p className="text-muted text-base leading-relaxed mb-6">
              Advanced abrasive blasting and industrial coating systems
              engineered to protect and extend the life of pipelines, tanks,
              and other industrial structures against the harshest
              conditions.
            </p>
            <div className="mt-auto">
              <ChartIllustration />
            </div>
          </div>
          <div className="bento-card p-6 lg:p-8 flex flex-col">
            <h3 className="font-display font-semibold text-2xl text-ink mb-3">
              Land &amp; Marine Logistics
            </h3>
            <p className="text-muted text-base leading-relaxed mb-6">
              End-to-end logistics solutions ensuring seamless transportation
              and supply chain operations - from heavy equipment delivery to
              remote locations through to marine freight coordination.
            </p>
            <div className="mt-auto">
              <OrgDiagram />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6 items-stretch">
          <div className="glow-card p-8 flex flex-col justify-between min-h-[280px] relative">
            <div className="relative z-10">
              <a 
                href="#contact" 
                className="icon-tile w-12 h-12 mb-6 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                title="Contact our team"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" fill="white" />
                </svg>
              </a>
              <h3 className="font-display font-semibold text-2xl text-ink mb-3">
                Not sure what you need?
              </h3>
              <p className="text-ink/70 text-sm leading-relaxed mb-6">
                Speak with our engineering team for a free scoping call.
                We&apos;ll review your requirements and recommend the right
                service mix.
              </p>
            </div>
            <a
              href="#contact"
              className="relative z-10 inline-flex items-center gap-2 bg-ink text-white text-sm font-medium px-5 py-3 rounded-full w-fit"
            >
              Schedule a Call
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <div 
            className="bento-card p-6 lg:p-8 flex flex-col justify-between"
            onMouseLeave={() => setActiveCategory(null)}
          >
            <div className="grid grid-cols-1 grid-rows-1 mb-8">
              {/* Default State */}
              <div 
                className={`col-start-1 row-start-1 transition-all duration-300 ease-out ${
                  activeCategory === null 
                    ? "opacity-100 translate-y-0 pointer-events-auto" 
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                <h3 className="font-display font-semibold text-2xl text-ink mb-3">
                  Procurement &amp; Supply Chain Solutions
                </h3>
                <p className="text-muted text-base leading-relaxed">
                  We source and supply high-quality equipment to support oil and gas operations, ensuring efficiency and compliance.
                </p>
              </div>

              {/* Category States */}
              {CATEGORIES.map((cat) => (
                <div 
                  key={cat.id}
                  className={`col-start-1 row-start-1 transition-all duration-300 ease-out ${
                    activeCategory === cat.id 
                      ? "opacity-100 translate-y-0 pointer-events-auto" 
                      : "opacity-0 translate-y-2 pointer-events-none"
                  }`}
                >
                  <h3 className="font-display font-semibold text-2xl text-ink mb-3">
                    {cat.title}
                  </h3>
                  <p className="text-muted text-base leading-relaxed">
                    {cat.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onMouseEnter={() => setActiveCategory(cat.id)}
                  className={`rounded-full py-2.5 px-3 text-center text-xs sm:text-sm font-medium border transition-colors duration-200 ${
                    activeCategory === cat.id
                      ? "bg-ink border-ink text-white"
                      : "bg-white border-line text-ink hover:bg-ink hover:text-white hover:border-ink"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
