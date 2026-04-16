'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const linkuri = [
  { label: 'Beneficii', href: '/#features' },
  { label: 'Meniu', href: '/#menu' },
  { label: 'Rezervă', href: '/rezervari', cta: true },
];

export default function Navigation() {
  const [scrollat, setScrollat] = useState(false);
  const [menuDeschis, setMenuDeschis] = useState(false);
  const pathname = usePathname();

  const peHomepage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrollat(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Închide meniul mobil la resize
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMenuDeschis(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navTransparent = peHomepage && !scrollat && !menuDeschis;

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300
      ${navTransparent
        ? 'bg-transparent'
        : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className={`text-xl font-bold tracking-tight transition-colors duration-300
            ${navTransparent ? 'text-[#D4AF72]' : 'text-stone-900'}`}
        >
          Vibe Caffè
        </Link>

        {/* Linkuri desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {linkuri.map((link) =>
            link.cta ? (
              <Link
                key={link.href}
                href={link.href}
                className="px-5 py-2 bg-[#D4AF72] hover:bg-stone-900 text-stone-900 hover:text-[#D4AF72] font-semibold rounded-full text-sm transition-all duration-300"
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-300 hover:text-[#D4AF72]
                  ${navTransparent ? 'text-white/90' : 'text-stone-600'}`}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Hamburger mobil */}
        <button
          onClick={() => setMenuDeschis(!menuDeschis)}
          className={`md:hidden flex flex-col gap-1.5 p-1 transition-colors duration-300
            ${navTransparent ? 'text-white' : 'text-stone-700'}`}
          aria-label="Meniu"
        >
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuDeschis ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuDeschis ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuDeschis ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Meniu mobil */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-white/95 backdrop-blur-md
        ${menuDeschis ? 'max-h-64 border-t border-gray-100' : 'max-h-0'}`}
      >
        <nav className="flex flex-col px-6 py-4 gap-4">
          {linkuri.map((link) =>
            link.cta ? (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuDeschis(false)}
                className="px-5 py-2.5 bg-[#D4AF72] hover:bg-stone-900 text-stone-900 hover:text-[#D4AF72] font-semibold rounded-full text-sm text-center transition-all duration-300"
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuDeschis(false)}
                className="text-stone-700 hover:text-[#D4AF72] font-medium text-sm transition-colors duration-300"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
