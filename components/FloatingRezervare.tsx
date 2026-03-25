'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FloatingRezervare() {
  const pathname = usePathname();

  if (pathname === '/rezervari') return null;

  return (
    <Link
      href="/rezervari"
      className="fixed right-6 bottom-8 z-50 flex items-center gap-2 px-5 py-3 bg-[#D4AF72] hover:bg-black text-stone-900 hover:text-[#D4AF72] font-semibold rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
    >
      <span className="text-lg">☕</span>
      <span className="hidden sm:inline">Rezervă o masă</span>
    </Link>
  );
}
