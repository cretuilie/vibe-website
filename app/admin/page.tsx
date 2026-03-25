'use client';

import { useEffect, useState } from 'react';
import { getRezervarile, schimbaStatus, stergeRezervare, StatusRezervare } from '@/app/actions/rezervari';

type Rezervare = {
  id: string;
  nume: string;
  email: string;
  telefon: string;
  numar_persoane: number;
  status: StatusRezervare;
  data_rezervare: string;
  ora_rezervare: string;
  created_at: string;
};

const STATUS_BADGE: Record<StatusRezervare, string> = {
  'in asteptare': 'bg-amber-100 text-amber-700 border-amber-200',
  'confirmat':    'bg-teal-100 text-teal-700 border-teal-200',
  'respins':      'bg-red-100 text-red-600 border-red-200',
};

const LUNA = ['Ian','Feb','Mar','Apr','Mai','Iun','Iul','Aug','Sep','Oct','Nov','Dec'];

function formatData(data: string) {
  const d = new Date(data);
  return `${d.getDate()} ${LUNA[d.getMonth()]} ${d.getFullYear()}`;
}

export default function AdminPage() {
  const [rezervari, setRezervari] = useState<Rezervare[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtruStatus, setFiltruStatus] = useState<string>('toate');
  const [cautare, setCautare] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const incarcaRezervari = async () => {
    const result = await getRezervarile();
    if (result.succes && result.date) setRezervari(result.date as Rezervare[]);
    setLoading(false);
  };

  useEffect(() => { incarcaRezervari(); }, []);

  const handleStatus = async (id: string, status: StatusRezervare) => {
    setLoadingId(id);
    await schimbaStatus(id, status);
    await incarcaRezervari();
    setLoadingId(null);
  };

  const handleSterge = async (id: string) => {
    if (!confirm('Sigur vrei să ștergi această rezervare?')) return;
    setLoadingId(id);
    await stergeRezervare(id);
    await incarcaRezervari();
    setLoadingId(null);
  };

  const rezervariFiltrate = rezervari.filter((r) => {
    const potrivireStatus = filtruStatus === 'toate' || r.status === filtruStatus;
    const potrivireCautare = r.nume.toLowerCase().includes(cautare.toLowerCase());
    return potrivireStatus && potrivireCautare;
  });

  const numarPerStatus = {
    toate: rezervari.length,
    'in asteptare': rezervari.filter(r => r.status === 'in asteptare').length,
    confirmat: rezervari.filter(r => r.status === 'confirmat').length,
    respins: rezervari.filter(r => r.status === 'respins').length,
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-stone-900 mb-1">
            Panou <span className="text-teal-500">Admin</span>
          </h1>
          <p className="text-stone-400">Gestionează rezervările Vibe Caffè</p>
        </div>

        {/* FILTRE + CAUTARE */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-3">
          {/* Filtre status */}
          <div className="flex flex-wrap gap-2">
            {(['toate', 'in asteptare', 'confirmat', 'respins'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFiltruStatus(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200
                  ${filtruStatus === s
                    ? 'bg-teal-500 text-white border-teal-500'
                    : 'bg-white text-stone-500 border-gray-200 hover:border-teal-300'}`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
                <span className="ml-1.5 text-xs opacity-70">({numarPerStatus[s]})</span>
              </button>
            ))}
          </div>

          {/* Cautare */}
          <input
            type="text"
            placeholder="Caută după nume..."
            value={cautare}
            onChange={(e) => setCautare(e.target.value)}
            className="md:ml-auto px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-400 outline-none text-sm transition-colors"
          />
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20 text-stone-400">Se încarcă rezervările...</div>
        )}

        {/* NICIO REZERVARE */}
        {!loading && rezervariFiltrate.length === 0 && (
          <div className="text-center py-20 text-stone-400">
            <div className="text-5xl mb-3">📋</div>
            <p>Nicio rezervare găsită.</p>
          </div>
        )}

        {/* TABEL DESKTOP */}
        {!loading && rezervariFiltrate.length > 0 && (
          <>
            <div className="hidden md:block bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-teal-50/80 text-teal-700 text-left">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Nume</th>
                    <th className="px-5 py-3 font-semibold">Contact</th>
                    <th className="px-5 py-3 font-semibold">Data & Ora</th>
                    <th className="px-5 py-3 font-semibold">Persoane</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Actiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {rezervariFiltrate.map((r, i) => (
                    <tr key={r.id} className={`border-t border-gray-100 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                      <td className="px-5 py-4 font-semibold text-stone-800">{r.nume}</td>
                      <td className="px-5 py-4 text-stone-500">
                        <div>{r.email}</div>
                        <div>{r.telefon}</div>
                      </td>
                      <td className="px-5 py-4 text-stone-600">
                        <div>{formatData(r.data_rezervare)}</div>
                        <div className="text-stone-400">{r.ora_rezervare}</div>
                      </td>
                      <td className="px-5 py-4 text-stone-600">{r.numar_persoane} pers.</td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_BADGE[r.status]}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          {r.status !== 'confirmat' && (
                            <button
                              onClick={() => handleStatus(r.id, 'confirmat')}
                              disabled={loadingId === r.id}
                              className="px-3 py-1 bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                            >✓</button>
                          )}
                          {r.status !== 'respins' && (
                            <button
                              onClick={() => handleStatus(r.id, 'respins')}
                              disabled={loadingId === r.id}
                              className="px-3 py-1 bg-orange-400 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                            >✕</button>
                          )}
                          <button
                            onClick={() => handleSterge(r.id)}
                            disabled={loadingId === r.id}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                          >🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CARDURI MOBILE */}
            <div className="md:hidden space-y-4">
              {rezervariFiltrate.map((r) => (
                <div key={r.id} className="bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-sm p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-stone-900">{r.nume}</p>
                      <p className="text-stone-400 text-sm">{r.email}</p>
                      <p className="text-stone-400 text-sm">{r.telefon}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_BADGE[r.status]}`}>
                      {r.status}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-stone-500 mb-4">
                    <span>📅 {formatData(r.data_rezervare)}</span>
                    <span>🕐 {r.ora_rezervare}</span>
                    <span>👥 {r.numar_persoane} pers.</span>
                  </div>
                  <div className="flex gap-2">
                    {r.status !== 'confirmat' && (
                      <button
                        onClick={() => handleStatus(r.id, 'confirmat')}
                        disabled={loadingId === r.id}
                        className="flex-1 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                      >Confirmă</button>
                    )}
                    {r.status !== 'respins' && (
                      <button
                        onClick={() => handleStatus(r.id, 'respins')}
                        disabled={loadingId === r.id}
                        className="flex-1 py-2 bg-orange-400 hover:bg-orange-500 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                      >Respinge</button>
                    )}
                    <button
                      onClick={() => handleSterge(r.id)}
                      disabled={loadingId === r.id}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                    >🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </main>
  );
}
