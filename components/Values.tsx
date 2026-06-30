import Image from "next/image";

const values = [
  {
    num: "01",
    title: "Client-First Approach",
    desc: "Every solution is engineered around your operational goals, timelines, and safety requirements.",
    img: "/client-first.png",
  },
  {
    num: "02",
    title: "End-to-End Capability",
    desc: "From procurement through installation, we handle every stage of the supply chain in-house.",
    img: "/end-to-end.png",
  },
  {
    num: "03",
    title: "Indigenous Excellence",
    desc: "A proudly Nigerian firm setting new industrial standards for the domestic energy sector.",
    img: "/indigenous-excellence.png",
  },
];

export default function Values() {
  return (
    <section id="values" className="py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="section-badge mb-6">
            <span className="dot" />
            Values
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
              <div className="value-card aspect-square mb-6 relative overflow-hidden group">
                <Image
                  src={v.img}
                  alt={v.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Dark gradient overlay to keep it feeling like a black/dark card while showing the image */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#15171C]/90 via-[#15171C]/40 to-[#15171C]/20 group-hover:via-[#15171C]/35 transition-all duration-300 z-10" />
                <span className="absolute bottom-5 left-5 font-mono text-xs text-white/70 bg-white/10 backdrop-blur-md rounded-full px-3 py-1 z-20">
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
