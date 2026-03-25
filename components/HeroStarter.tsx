/**
 * 🎯 HERO STARTER - Versiunea simplă pentru cursanți
 *
 * Aceasta este versiunea MINIMALISTĂ de la care plecăm în curs.
 * Fără animații, fără video, fără JavaScript complex.
 * Doar HTML + Tailwind CSS = fundația de bază.
 */

'use client';

export default function HeroStarter() {
  const scrollToNext = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* VIDEO FUNDAL */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://assets.mixkit.co/videos/41865/41865-1080.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY SEMI-TRANSPARENT */}
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        {/* TITLU PRINCIPAL */}
        <h1
          className="hero-fade-title text-6xl md:text-8xl lg:text-9xl font-bold mb-6 text-white"
          style={{ textShadow: "0 4px 24px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5)" }}
        >
          Vibe Caffè — Simte Cafeaua
        </h1>

        {/* SUBTITLU */}
        <p
          className="hero-fade-subtitle text-2xl md:text-3xl mb-8 text-white/90"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
        >
          Fiecare ceasca spune o poveste.
        </p>

        {/* BUTOANE CTA */}
        <div className="hero-fade-buttons flex flex-col sm:flex-row gap-4 justify-center">
          {/* Buton Primary */}
          <a
            href="#menu"
            className="inline-flex items-center justify-center px-5 py-2 bg-[#D4AF72] hover:bg-black text-stone-900 hover:text-[#D4AF72] font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            Vezi Meniul
          </a>

          {/* Buton Secondary */}
          <a
            href="/rezervari"
            className="inline-flex items-center justify-center px-5 py-2 bg-transparent border-2 border-[#D4AF72] text-[#D4AF72] font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-[#D4AF72] hover:text-stone-900"
          >
            Rezervă o masă
          </a>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <button
        onClick={scrollToNext}
        className="hero-fade-scroll absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/75 hover:text-[#D4AF72] transition-colors duration-300 animate-bounce"
        aria-label="Scroll mai jos"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </section>
  );
}
