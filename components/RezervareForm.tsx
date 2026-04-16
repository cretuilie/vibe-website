'use client';

import { useState } from 'react';
import { salveazaRezervare } from '@/app/actions/rezervari';

// Returneaza zilele dintr-o luna calendaristica
function getZileLuna(an: number, luna: number) {
  const ultimaZi = new Date(an, luna + 1, 0);
  const primaZi = new Date(an, luna, 1);
  const zile = [];
  for (let d = 1; d <= ultimaZi.getDate(); d++) {
    zile.push(new Date(an, luna, d));
  }
  // Offset luni (Lu=0 ... Du=6)
  const offsetLuni = (primaZi.getDay() + 6) % 7;
  return { zile, offsetLuni };
}

// Genereaza orele 10:00 - 22:00 la interval de 30 minute
function getOreDisponibile() {
  const ore = [];
  for (let h = 10; h <= 22; h++) {
    ore.push(`${String(h).padStart(2, '0')}:00`);
    if (h < 22) ore.push(`${String(h).padStart(2, '0')}:30`);
  }
  return ore;
}

const ZI_SCURTA = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'];
const LUNA_LUNGA = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
const LUNA_SCURTA = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type Pas = 1 | 2 | 3;

export default function RezervareForm() {
  const azi = new Date();
  const [pas, setPas] = useState<Pas>(1);
  const [dataSelectata, setDataSelectata] = useState<Date | null>(null);
  const [oraSelectata, setOraSelectata] = useState<string | null>(null);
  const [form, setForm] = useState({ nume: '', email: '', telefon: '', numar_persoane: 2 });
  const [loading, setLoading] = useState(false);
  const [confirmare, setConfirmare] = useState(false);
  const [eroare, setEroare] = useState('');
  const [lunaCalendar, setLunaCalendar] = useState(azi.getMonth());
  const [anCalendar, setAnCalendar] = useState(azi.getFullYear());

  const ore = getOreDisponibile();
  const { zile, offsetLuni } = getZileLuna(anCalendar, lunaCalendar);

  // Limita maxima: 6 luni in viitor
  const lunaMax = new Date(azi.getFullYear(), azi.getMonth() + 6, 1);
  const poateMergeInainte = new Date(anCalendar, lunaCalendar + 1, 1) < lunaMax;
  const poateMergeInapoi = !(anCalendar === azi.getFullYear() && lunaCalendar === azi.getMonth());

  const mergeInainte = () => {
    if (lunaCalendar === 11) { setLunaCalendar(0); setAnCalendar(anCalendar + 1); }
    else setLunaCalendar(lunaCalendar + 1);
  };
  const mergeInapoi = () => {
    if (lunaCalendar === 0) { setLunaCalendar(11); setAnCalendar(anCalendar - 1); }
    else setLunaCalendar(lunaCalendar - 1);
  };

  const esteDisponibila = (zi: Date) => zi >= new Date(azi.getFullYear(), azi.getMonth(), azi.getDate());

  const handleSubmit = async () => {
    setLoading(true);
    setEroare('');
    const rezultat = await salveazaRezervare({
      nume: form.nume,
      email: form.email,
      telefon: form.telefon,
      numar_persoane: form.numar_persoane,
      data_rezervare: dataSelectata!.toISOString().split('T')[0],
      ora_rezervare: oraSelectata!,
    });
    setLoading(false);
    if (rezultat.succes) setConfirmare(true);
    else setEroare(rezultat.mesaj);
  };

  if (confirmare) {
    return (
      <div className="text-center py-16 px-6">
        <div className="text-6xl mb-4">☕</div>
        <h3 className="text-3xl font-bold text-stone-900 mb-3">Rezervare confirmată!</h3>
        <p className="text-stone-500 text-lg mb-2">
          {dataSelectata && `${dataSelectata.getDate()} ${LUNA_SCURTA[dataSelectata.getMonth()]} ${dataSelectata.getFullYear()} — ${oraSelectata}`}
        </p>
        <p className="text-stone-500">Te așteptăm, <span className="font-semibold text-stone-800">{form.nume}</span>!</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <a
            href="/"
            className="px-6 py-3 border-2 border-stone-300 hover:border-stone-500 text-stone-600 hover:text-stone-900 font-semibold rounded-lg transition-all duration-300 text-center"
          >
            ← Înapoi pe site
          </a>
          <button
            onClick={() => { setConfirmare(false); setPas(1); setDataSelectata(null); setOraSelectata(null); setForm({ nume: '', email: '', telefon: '', numar_persoane: 2 }); }}
            className="px-6 py-3 bg-[#D4AF72] hover:bg-black hover:text-[#D4AF72] text-stone-900 font-semibold rounded-lg transition-all duration-300"
          >
            Rezervare nouă
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">

      {/* INDICATOR PASI */}
      <div className="flex items-center justify-center mb-10 gap-0">
        {[1, 2, 3].map((p) => (
          <div key={p} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
              ${pas === p ? 'bg-[#D4AF72] text-stone-900 scale-110' : pas > p ? 'bg-stone-800 text-white' : 'bg-gray-200 text-stone-400'}`}>
              {pas > p ? '✓' : p}
            </div>
            {p < 3 && <div className={`w-16 h-1 transition-all duration-300 ${pas > p ? 'bg-stone-800' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* PAS 1 — CALENDAR 6 LUNI */}
      {pas === 1 && (
        <div>
          <h3 className="text-2xl font-bold text-stone-900 mb-6 text-center">Alege data</h3>

          {/* Header navigare luna */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={mergeInapoi}
              disabled={!poateMergeInapoi}
              className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center text-stone-500 hover:border-[#D4AF72] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >‹</button>
            <span className="font-bold text-stone-900 text-lg">
              {LUNA_LUNGA[lunaCalendar]} {anCalendar}
            </span>
            <button
              onClick={mergeInainte}
              disabled={!poateMergeInainte}
              className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center text-stone-500 hover:border-[#D4AF72] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >›</button>
          </div>

          {/* Header zile saptamana */}
          <div className="grid grid-cols-7 mb-2">
            {ZI_SCURTA.map((z) => (
              <div key={z} className="text-center text-xs font-semibold text-stone-400 py-1">{z}</div>
            ))}
          </div>

          {/* Grid zile */}
          <div className="grid grid-cols-7 gap-1">
            {/* Celule goale pentru offset */}
            {Array.from({ length: offsetLuni }).map((_, i) => <div key={`empty-${i}`} />)}

            {zile.map((zi, i) => {
              const disponibila = esteDisponibila(zi);
              const selectata = dataSelectata?.toDateString() === zi.toDateString();
              const esteAzi = zi.toDateString() === azi.toDateString();
              return (
                <button
                  key={i}
                  onClick={() => { if (disponibila) { setDataSelectata(zi); setPas(2); } }}
                  disabled={!disponibila}
                  className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-200
                    ${selectata ? 'bg-[#D4AF72] text-stone-900 scale-105 font-bold' :
                      esteAzi ? 'border-2 border-[#D4AF72] text-stone-900 hover:bg-[#D4AF72]/10' :
                      disponibila ? 'hover:bg-[#D4AF72]/10 hover:border-[#D4AF72] border-2 border-transparent text-stone-700' :
                      'text-stone-300 cursor-not-allowed'}`}
                >
                  {zi.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* PAS 2 — ALEGE ORA */}
      {pas === 2 && (
        <div>
          <h3 className="text-2xl font-bold text-stone-900 mb-2 text-center">Alege ora</h3>
          <p className="text-center text-stone-400 mb-6">
            {dataSelectata && `${dataSelectata.getDate()} ${LUNA_SCURTA[dataSelectata.getMonth()]} ${dataSelectata.getFullYear()}`}
          </p>
          <div className="grid grid-cols-4 gap-3">
            {ore.map((ora) => (
              <button
                key={ora}
                onClick={() => { setOraSelectata(ora); setPas(3); }}
                className={`py-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200 hover:scale-105
                  ${oraSelectata === ora
                    ? 'border-[#D4AF72] bg-[#D4AF72]/10 text-stone-900'
                    : 'border-gray-200 hover:border-[#D4AF72] text-stone-600'}`}
              >
                {ora}
              </button>
            ))}
          </div>
          <button onClick={() => setPas(1)} className="mt-6 text-stone-400 hover:text-stone-600 text-sm transition-colors">
            ← Inapoi
          </button>
        </div>
      )}

      {/* PAS 3 — DETALIILE TALE */}
      {pas === 3 && (
        <div>
          <h3 className="text-2xl font-bold text-stone-900 mb-2 text-center">Detaliile tale</h3>
          <p className="text-center text-stone-400 mb-6">
            {dataSelectata && `${dataSelectata.getDate()} ${LUNA_SCURTA[dataSelectata.getMonth()]} ${dataSelectata.getFullYear()} — ${oraSelectata}`}
          </p>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nume complet"
              value={form.nume}
              onChange={(e) => setForm({ ...form, nume: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D4AF72] outline-none transition-colors"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D4AF72] outline-none transition-colors"
            />
            <input
              type="tel"
              placeholder="Telefon"
              value={form.telefon}
              onChange={(e) => setForm({ ...form, telefon: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D4AF72] outline-none transition-colors"
            />
            <div>
              <label className="block text-stone-600 text-sm mb-2">Număr persoane</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setForm({ ...form, numar_persoane: Math.max(1, form.numar_persoane - 1) })}
                  className="w-10 h-10 rounded-full border-2 border-gray-200 font-bold text-lg hover:border-[#D4AF72] transition-colors"
                >−</button>
                <span className="text-2xl font-bold text-stone-900 w-8 text-center">{form.numar_persoane}</span>
                <button
                  onClick={() => setForm({ ...form, numar_persoane: Math.min(12, form.numar_persoane + 1) })}
                  className="w-10 h-10 rounded-full border-2 border-gray-200 font-bold text-lg hover:border-[#D4AF72] transition-colors"
                >+</button>
                <span className="text-stone-400 text-sm ml-2">max 12 persoane</span>
              </div>
            </div>
          </div>

          {eroare && <p className="text-red-500 text-sm mt-3">{eroare}</p>}

          <div className="flex gap-3 mt-6">
            <button onClick={() => setPas(2)} className="px-5 py-3 border-2 border-gray-200 rounded-xl text-stone-600 hover:border-stone-400 transition-colors">
              ← Inapoi
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !form.nume || !form.email || !form.telefon}
              className="flex-1 py-3 bg-[#D4AF72] hover:bg-black hover:text-[#D4AF72] text-stone-900 font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Se salvează...' : 'Confirmă rezervarea'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
