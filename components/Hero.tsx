import Image from "next/image";

const partners = [
  { name: "Bogaty Centrum", src: "/logos/centrum-hub.png" },
  { name: "Bogaty Farms", src: "/logos/sub-farms.png" },
  { name: "CentzMi", src: "/logos/sub-centzmi.png" },
  { name: "SwiftCent", src: "/logos/sub-swiftcent.png" },
  { name: "Boga", src: "/logos/sub-boga.png" },
  { name: "Nucleon Projects", src: "/logos/partner-nucleon.png" },
  { name: "Celefrank Nigeria", src: "/logos/partner-celefrank.png" },
  { name: "VersaBuild", src: "/logos/partner-versabuild.png" },
  { name: "MAIRE", src: "/logos/partner-maire.png" },
  { name: "Forza", src: "/logos/partner-forza.png" },
];

export default function Hero() {
  return (
    <section className="relative pt-40 pb-20 overflow-hidden text-white">
      {/* Background Image with Dark Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/logos/BogBG.jpg')",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(21, 23, 28, 0.7) 0%, rgba(21, 23, 28, 0.85) 60%, var(--paper) 100%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center">
        {/* Eyebrow */}
        <div
          className="section-badge mb-8 fade-up-delay-1 mx-auto"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            borderColor: "rgba(255, 255, 255, 0.15)",
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <span className="dot" />
          Indigenous Engineering Partner
        </div>

        {/* Headline */}
        <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-white mb-6 fade-up-delay-2">
          Engineering Solutions
          <br />
          for{" "}
          <span className="text-gold-light">Modern Energy</span>
        </h1>

        <p className="text-white/70 text-lg leading-relaxed max-w-xl mx-auto mb-10 fade-up-delay-3">
          We build bespoke engineering solutions that address the complex
          challenges faced by our clients in the oil and gas industry -
          procurement, logistics, safety, and pipeline integrity.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 fade-up-delay-4">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light transition-colors text-ink font-semibold text-sm px-6 py-3.5 rounded-full"
          >
            Get a Quote
          </a>
          <a
            href="#services"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-colors text-white font-medium text-sm px-6 py-3.5 rounded-full"
          >
            Our Services
          </a>
        </div>
      </div>

      {/* Partner logo marquee */}
      <div className="relative mt-20 overflow-hidden">
        <div className="marquee-track gap-3 px-6">
          {[...partners, ...partners].map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full pl-2 pr-5 py-2 shrink-0"
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
                <Image src={p.src} alt={p.name} width={32} height={32} className="object-contain w-full h-full p-1" />
              </div>
              <span className="text-sm text-white/90 whitespace-nowrap">{p.name}</span>
            </div>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent pointer-events-none" />
      </div>

      {/* Stats bar */}
      <div className="relative max-w-5xl mx-auto px-6 lg:px-8 mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { value: "7", label: "Years of Operation" },
          { value: "150+", label: "Projects Delivered" },
          { value: "98%", label: "Client Retention" },
          { value: "28", label: "Offshore Sites Serviced" },
        ].map((s) => (
          <div key={s.label}>
            <div className="font-display font-bold text-3xl text-gold-light mb-1">
              {s.value}
            </div>
            <div className="text-white/60 text-xs uppercase tracking-wider font-mono">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
