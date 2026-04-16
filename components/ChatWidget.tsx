'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const MESAJ_INITIAL: Message = {
  role: 'assistant',
  content: 'Bună! ☕ Sunt Barista Bot, asistentul tău virtual la Vibe Caffè. Te ajut să alegi cafeaua perfectă sau să faci o rezervare. Cu ce pot să te ajut?',
};

export default function ChatWidget() {
  const [deschis, setDeschis] = useState(false);
  const [mesaje, setMesaje] = useState<Message[]>([MESAJ_INITIAL]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const mesajeRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll automat la ultimul mesaj
  useEffect(() => {
    if (mesajeRef.current) {
      mesajeRef.current.scrollTop = mesajeRef.current.scrollHeight;
    }
  }, [mesaje]);

  // Focus pe input când se deschide
  useEffect(() => {
    if (deschis) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [deschis]);

  const trimite = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const mesajeNoi: Message[] = [...mesaje, { role: 'user', content: text }];
    setMesaje(mesajeNoi);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: mesajeNoi.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMesaje([...mesajeNoi, { role: 'assistant', content: data.reply }]);
    } catch {
      setMesaje([...mesajeNoi, { role: 'assistant', content: 'Ups, ceva nu a mers. Încearcă din nou. ☕' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      trimite();
    }
  };

  return (
    <>
      {/* Fereastra de chat */}
      {deschis && (
        <div className="fixed bottom-36 right-6 z-50 w-[350px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ height: '480px' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#D4AF72]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">☕</div>
              <div>
                <p className="font-bold text-stone-900 text-sm">Barista Bot</p>
                <p className="text-stone-700 text-xs">Vibe Caffè · Online</p>
              </div>
            </div>
            <button
              onClick={() => setDeschis(false)}
              className="w-7 h-7 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-stone-800 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Mesaje */}
          <div
            ref={mesajeRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-stone-50"
          >
            {mesaje.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed
                    ${m.role === 'user'
                      ? 'bg-[#D4AF72] text-stone-900 rounded-br-sm'
                      : 'bg-white text-stone-700 shadow-sm border border-gray-100 rounded-bl-sm'
                    }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-2 rounded-2xl rounded-bl-sm">
                  <span className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-[#D4AF72] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#D4AF72] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#D4AF72] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 bg-white flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Scrie un mesaj..."
              disabled={loading}
              className="flex-1 px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:border-[#D4AF72] outline-none transition-colors disabled:opacity-50"
            />
            <button
              onClick={trimite}
              disabled={!input.trim() || loading}
              className="w-9 h-9 bg-[#D4AF72] hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors"
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
          className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-stone-900 hover:bg-[#D4AF72] text-white hover:text-stone-900 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 animate-pulse-slow"
          aria-label="Deschide chat"
        >
          💬
        </button>
      )}
    </>
  );
}
