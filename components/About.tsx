export default function About() {
  return (
    <section id="about" className="py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="section-badge mb-6">
            <span className="dot" />
            · Who We Are
          </div>
          <h2 className="font-display font-bold text-4xl lg:text-6xl text-ink leading-tight mb-4 max-w-3xl mx-auto">
            Bespoke Engineering for the Energy Sector
          </h2>
          <p className="text-muted text-base max-w-2xl mx-auto leading-relaxed">
            We help operators, contractors, and industrial sites design and
            deliver procurement, logistics, and pipeline integrity solutions
            that streamline operations and unlock dependable performance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bento-card p-8 lg:p-10">
            <span className="section-badge mb-5">
              <span className="dot" />
              Mission
            </span>
            <p className="text-ink text-lg leading-relaxed">
              To provide cutting-edge STEM solutions that drive efficiency,
              sustainability and innovation in the oil and gas sector —
              prioritising precision, integrity and client satisfaction in
              every project we undertake.
            </p>
          </div>
          <div className="bento-card p-8 lg:p-10">
            <span className="section-badge mb-5">
              <span className="dot" />
              Vision
            </span>
            <p className="text-ink text-lg leading-relaxed">
              To be the leading indigenous provider of STEM solutions in
              Nigeria, contributing to the growth of the energy sector by
              delivering exceptional services that set new industrial
              standards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
