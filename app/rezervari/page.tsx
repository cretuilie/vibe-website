import RezervareForm from '@/components/RezervareForm';

export default function PaginaRezervari() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50">

      {/* HERO SECTIUNE */}
      <div className="relative py-20 px-6 text-center overflow-hidden">
        {/* Blur background circles */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl -z-10" />

        <h1 className="text-5xl md:text-6xl font-bold text-stone-900 mb-4">
          Rezervă o <span className="text-teal-500">masă</span>
        </h1>
        <p className="text-xl text-stone-500 max-w-xl mx-auto">
          Alege data, ora și spune-ne câți sunteți — ne ocupăm noi de rest.
        </p>
      </div>

      {/* FORMULAR */}
      <div className="pb-20 px-6">
        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white p-8 md:p-12">
          <RezervareForm />
        </div>
      </div>

    </main>
  );
}
