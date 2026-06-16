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
    <path key="a" d="M4 6h16M4 12h16M4 18h10" stroke="white" strokeWidth="2" strokeLinecap="round" />,
    <circle key="b" cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />,
    <path key="c" d="M3 12h18M12 3v18" stroke="white" strokeWidth="2" strokeLinecap="round" />,
  ];
  return (
    <div className="bento-card p-6 flex flex-col items-center justify-center gap-4 min-h-[180px]">
      <div className="icon-tile w-11 h-11 shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 8l10 6 10-6-10-6z" fill="white" />
          <path d="M2 16l10 6 10-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
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

function IconRow() {
  const icons = [
    <path key="a" d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" />,
    <circle key="b" cx="12" cy="12" r="9" />,
    <path key="c" d="M12 4a8 8 0 110 16 8 8 0 010-16zm0 4v4l3 2" />,
    <path key="d" d="M4 19h16M6 19V9l6-4 6 4v10" />,
  ];
  return (
    <div className="grid grid-cols-4 gap-3">
      {icons.map((p, i) => (
        <div key={i} className="bento-card aspect-square flex items-center justify-center">
          <div className="icon-tile-light w-12 h-12">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B6E76" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              {p}
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Services() {
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
              <div className="icon-tile w-12 h-12 mb-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" fill="white" />
                </svg>
              </div>
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

          <div className="bento-card p-6 lg:p-8 flex flex-col">
            <h3 className="font-display font-semibold text-2xl text-ink mb-3">
              Electricals &amp; Safety Apparatus
            </h3>
            <p className="text-muted text-base leading-relaxed mb-6">
              Access to high-quality electrical equipment and reliable safety
              gear tailored to meet regulatory standards across offshore and
              onshore operations.
            </p>
            <div className="mt-auto">
              <IconRow />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
