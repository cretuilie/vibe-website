'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// Parsează [text](url) → link clickabil
function RenderMesaj({ text }: { text: string }) {
  const parts = text.split(/(\[([^\]]+)\]\(([^)]+)\))/g);
  const elemente: React.ReactNode[] = [];
  let i = 0;
  while (i < parts.length) {
    const part = parts[i];
    if (/^\[([^\]]+)\]\(([^)]+)\)$/.test(part)) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const [, label, href] = match;
        const isIntern = href.startsWith('/');
        elemente.push(
          isIntern ? (
            <Link key={i} href={href} className="underline font-semibold hover:text-[#D4AF72] transition-colors">
              {label}
            </Link>
          ) : (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-[#D4AF72] transition-colors">
              {label}
            </a>
          )
        );
      }
    } else if (part) {
      elemente.push(<span key={i}>{part}</span>);
    }
    i++;
  }
  return <>{elemente}</>;
}

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const MESAJ_INITIAL: Message = {
  role: 'assistant',
  content: 'Bună! ☕ Sunt Barista Bot, asistentul tău virtual la Vibe Caffè. Te ajut să alegi cafeaua perfectă sau să faci o rezervare. Cu ce pot să te ajut?',
};

const QUICK_REPLIES_INITIALE = ['Vezi meniu', 'Recomandări', 'Rezervări', 'Program'];

// Detectează ce butoane contextuale să afișeze după un răspuns al botului
function getQuickRepliesContextuale(continut: string): string[] {
  const text = continut.toLowerCase();
  if (text.includes('meniu') || text.includes('cafea') || text.includes('espresso') || text.includes('latte')) {
    return ['Opțiuni vegane', 'Deserturi', 'Cafea rece'];
  }
  if (text.includes('rezerv')) {
    return ['Fă o rezervare', 'Program'];
  }
  return [];
}

export default function ChatWidget() {
  const [deschis, setDeschis] = useState(false);
  const [mesaje, setMesaje] = useState<Message[]>([MESAJ_INITIAL]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>(QUICK_REPLIES_INITIALE);
  const [userAScris, setUserAScris] = useState(false);
  const mesajeRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mesajeRef.current) {
      mesajeRef.current.scrollTop = mesajeRef.current.scrollHeight;
    }
  }, [mesaje, quickReplies]);

  useEffect(() => {
    if (deschis) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [deschis]);

  const trimiteMesaj = async (text: string, dinQuickReply = false) => {
    if (!text.trim() || loading) return;

    // Dacă userul a scris manual, ascunde butoanele
    if (!dinQuickReply) {
      setUserAScris(true);
      setQuickReplies([]);
    }

    const mesajeNoi: Message[] = [...mesaje, { role: 'user', content: text }];
    setMesaje(mesajeNoi);
    setInput('');
    setLoading(true);
    setQuickReplies([]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: mesajeNoi.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const raspuns = data.reply as string;

      setMesaje([...mesajeNoi, { role: 'assistant', content: raspuns }]);

      // Afișează butoane contextuale doar dacă userul nu a scris manual
      if (dinQuickReply || !userAScris) {
        setQuickReplies(getQuickRepliesContextuale(raspuns));
      }
    } catch {
      setMesaje([...mesajeNoi, { role: 'assistant', content: 'Ups, ceva nu a mers. Încearcă din nou. ☕' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    // Ascunde butoanele când userul începe să scrie
    if (e.target.value.length > 0 && quickReplies.length > 0) {
      setUserAScris(true);
      setQuickReplies([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      trimiteMesaj(input, false);
    }
  };

  return (
    <>
      {deschis && (
        <div className={`
          fixed z-50 flex flex-col overflow-hidden
          bg-white shadow-2xl border border-stone-200
          md:rounded-2xl md:bottom-36 md:right-6 md:w-[360px] md:h-[500px]
          inset-0 rounded-none md:inset-auto
        `}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-stone-900">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#D4AF72] rounded-full flex items-center justify-center text-lg font-bold text-stone-900">
                ☕
              </div>
              <div>
                <p className="font-bold text-white text-sm tracking-tight">Barista Bot</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#D4AF72] rounded-full" />
                  <p className="text-stone-400 text-xs">Vibe Caffè · Online</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setDeschis(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Mesaje */}
          <div ref={mesajeRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-stone-50">
            {mesaje.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed
                    ${m.role === 'user'
                      ? 'bg-[#D4AF72] text-stone-900 rounded-2xl rounded-br-sm font-medium'
                      : 'bg-white text-stone-700 shadow-sm border border-stone-100 rounded-2xl rounded-bl-sm'
                    }`}
                >
                  <RenderMesaj text={m.content} />
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm">
                  <span className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-[#D4AF72] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[#D4AF72] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[#D4AF72] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}

            {/* Quick replies */}
            {!loading && quickReplies.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => trimiteMesaj(reply, true)}
                    className="px-3 py-1.5 bg-white border-2 border-[#D4AF72] text-stone-700 hover:bg-[#D4AF72] hover:text-stone-900 text-xs font-semibold rounded-full transition-all duration-200 shadow-sm"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-stone-100 bg-white flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Scrie un mesaj..."
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm border-2 border-stone-200 rounded-xl focus:border-[#D4AF72] outline-none transition-colors disabled:opacity-50 bg-stone-50"
            />
            <button
              onClick={() => trimiteMesaj(input, false)}
              disabled={!input.trim() || loading}
              className="w-10 h-10 bg-[#D4AF72] hover:bg-stone-900 disabled:opacity-40 disabled:cursor-not-allowed text-stone-900 hover:text-[#D4AF72] rounded-xl flex items-center justify-center transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Buton floating */}
      {!deschis && (
        <button
          onClick={() => setDeschis(true)}
          className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-[#D4AF72] hover:bg-stone-900 text-stone-900 hover:text-[#D4AF72] rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 animate-pulse-slow"
          aria-label="Deschide chat"
        >
          💬
        </button>
      )}
    </>
  );
}
