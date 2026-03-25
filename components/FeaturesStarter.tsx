/**
 * 🎯 FEATURES STARTER - Sectiunea beneficii Vibe Coffee
 *
 * Bento Grid layout: 1 card mare stanga + 2 carduri mici dreapta
 * Cu imagini Unsplash, hover effects si scroll animations
 */

'use client';

import { useEffect, useRef, useState } from 'react';

const cards = [
  {
    emoji: '☕',
    title: 'Cafea de Specialitate',
    description: 'Selectam boabe din cele mai bune origini din lume. Fiecare ceasca este preparata cu grija, extras perfect pentru a scoate in evidenta aromele unice ale cafelei de specialitate.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop',
  },
  {
    emoji: '🥐',
    title: 'Patiserie Artizanală',
    description: 'Produse de patiserie proaspete, preparate zilnic din ingrediente naturale. Perechea perfecta pentru cafeaua ta.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop',
  },
  {
    emoji: '🌿',
    title: 'Ambient Relaxant',
    description: 'Un spatiu creat pentru confort si inspiratie. Vino sa te bucuri de liniste, muzica buna si atmosfera perfecta.',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop',
  },
];

export default function FeaturesStarter() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = cardRefs.current.map((ref, index) => {
      if (!ref) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleCards((prev) => {
                const next = [...prev];
                next[index] = true;
                return next;
              });
            }, index * 200);
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(ref);
      return observer;
    });

    return () => observers.forEach((obs) => obs?.disconnect());
  }, []);

  return (
    <section id="features" className="py-20 px-6 bg-gray-50 scroll-mt-20">
      <div className="max-w-6xl mx-auto">

        {/* TITLU SECTIUNE */}
        <div className="text-center mb-14">
          <h2 className="text-5xl font-bold text-stone-900 mb-4">
            De ce <span className="text-[#D4AF72]">Vibe Coffee?</span>
          </h2>
          <p className="text-xl text-stone-500">
            Experiență unică, ingrediente premium, atmosferă perfectă
          </p>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* CARD MARE - stanga (row-span-2) */}
          <div
            ref={(el) => { cardRefs.current[0] = el; }}
            className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 md:row-span-2
              hover:shadow-xl transition-all duration-300 cursor-pointer
              ${visibleCards[0] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transition: 'opacity 0.6s ease-out, transform 0.6s ease-out, box-shadow 0.3s ease' }}
          >
            {/* Imagine */}
            <div className="h-64 md:h-[45%] overflow-hidden">
              <img
                src={cards[0].image}
                alt={cards[0].title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            {/* Text */}
            <div className="p-8 md:p-10">
              <span className="text-4xl mb-4 block">{cards[0].emoji}</span>
              <h3 className="text-2xl font-bold text-stone-900 mb-3">{cards[0].title}</h3>
              <p className="text-stone-500 leading-relaxed">{cards[0].description}</p>
            </div>
          </div>

          {/* CARD MIC - sus dreapta */}
          <div
            ref={(el) => { cardRefs.current[1] = el; }}
            className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100
              hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col
              ${visibleCards[1] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transition: 'opacity 0.6s ease-out, transform 0.6s ease-out, box-shadow 0.3s ease' }}
          >
            <div className="h-[70%] overflow-hidden">
              <img
                src={cards[1].image}
                alt={cards[1].title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div className="h-[30%] p-4 flex flex-col justify-center">
              <h3 className="text-lg font-bold text-stone-900 mb-1">{cards[1].title}</h3>
              <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">{cards[1].description}</p>
            </div>
          </div>

          {/* CARD MIC - jos dreapta */}
          <div
            ref={(el) => { cardRefs.current[2] = el; }}
            className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100
              hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col
              ${visibleCards[2] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transition: 'opacity 0.6s ease-out, transform 0.6s ease-out, box-shadow 0.3s ease' }}
          >
            <div className="h-[70%] overflow-hidden">
              <img
                src={cards[2].image}
                alt={cards[2].title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div className="h-[30%] p-4 flex flex-col justify-center">
              <h3 className="text-lg font-bold text-stone-900 mb-1">{cards[2].title}</h3>
              <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">{cards[2].description}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
