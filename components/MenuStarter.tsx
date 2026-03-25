'use client';

import { useState } from 'react';

const menuData = {
  Espresso: [
    { name: 'Espresso', price: 12, description: 'Shot dublu de espresso intens', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&auto=format&fit=crop' },
    { name: 'Americano', price: 14, description: 'Espresso diluat cu apă caldă', image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400&auto=format&fit=crop' },
    { name: 'Cappuccino', price: 16, description: 'Espresso cu lapte spumat', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&auto=format&fit=crop' },
    { name: 'Flat White', price: 17, description: 'Microfoam mătăsos peste espresso', image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400&auto=format&fit=crop' },
    { name: 'Latte', price: 17, description: 'Espresso cu lapte abundant', image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400&auto=format&fit=crop' },
    { name: 'Cortado', price: 15, description: 'Espresso cu lapte cald în proporții egale', image: 'https://images.unsplash.com/photo-1523288926042-67186ad1ada0?w=400&auto=format&fit=crop' },
  ],
  Specialty: [
    { name: 'Pour Over', price: 18, description: 'Cafea filtrată manual, arome florale', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop' },
    { name: 'AeroPress', price: 16, description: 'Metodă de extracție rapidă, corp plin', image: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=400&auto=format&fit=crop' },
    { name: 'Chemex', price: 20, description: 'Filtru de hârtie, savoare curată și delicată', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&auto=format&fit=crop' },
    { name: 'Cold Drip', price: 22, description: 'Picurare lentă la rece, 12 ore', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop' },
    { name: 'Siphon', price: 24, description: 'Metodă de vacuum, aromă spectaculoasă', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&auto=format&fit=crop' },
    { name: 'Moka Pot', price: 15, description: 'Cafea italiană preparată clasic', image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=400&auto=format&fit=crop' },
  ],
  'Cold Brew': [
    { name: 'Cold Brew Classic', price: 18, description: 'Infuzat 24 ore la rece, fin și răcoritor', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop' },
    { name: 'Cold Brew Tonic', price: 20, description: 'Cold brew cu apă tonică și portocală', image: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=400&auto=format&fit=crop' },
    { name: 'Iced Latte', price: 17, description: 'Espresso rece cu lapte și gheață', image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&auto=format&fit=crop' },
    { name: 'Frappuccino', price: 19, description: 'Cafea mixată cu gheață și frișcă', image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400&auto=format&fit=crop' },
    { name: 'Iced Matcha Latte', price: 16, description: 'Matcha japonez cu lapte rece și gheață', image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&auto=format&fit=crop' },
  ],
  Patiserie: [
    { name: 'Croissant cu unt', price: 12, description: 'Foietaj franțuzesc, crocant și auriu', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop' },
    { name: 'Pain au Chocolat', price: 14, description: 'Croissant cu ciocolată belgiană', image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=400&auto=format&fit=crop' },
    { name: 'Cheesecake', price: 18, description: 'Cremos cu blat de biscuite și fructe', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&auto=format&fit=crop' },
    { name: 'Brownie', price: 15, description: 'Ciocolată neagră intensă, umed și dens', image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&auto=format&fit=crop' },
    { name: 'Ecler cu vanilie', price: 16, description: 'Aluat choux cu cremă de vanilie bourbon', image: 'https://images.unsplash.com/photo-1774119711073-36b8cc2490a2?w=400&auto=format&fit=crop' },
    { name: 'Tartă cu fructe', price: 17, description: 'Blat crocant cu cremă și fructe proaspete', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop' },
  ],
};

type Category = keyof typeof menuData;
const categories = Object.keys(menuData) as Category[];

export default function MenuStarter() {
  const [activeTab, setActiveTab] = useState<Category>('Espresso');
  const [fading, setFading] = useState(false);

  const handleTabChange = (cat: Category) => {
    if (cat === activeTab) return;
    setFading(true);
    setTimeout(() => {
      setActiveTab(cat);
      setFading(false);
    }, 200);
  };

  return (
    <section id="menu" className="py-20 px-6 bg-white scroll-mt-20">
      <div className="max-w-6xl mx-auto">

        {/* TITLU */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-stone-900 mb-4">
            Meniul <span className="text-[#D4AF72]">Nostru</span>
          </h2>
          <p className="text-xl text-stone-500">
            Preparate cu pasiune, servite cu zâmbetul
          </p>
        </div>

        {/* TAB-URI */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleTabChange(cat)}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300
                ${activeTab === cat
                  ? 'bg-amber-500 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-stone-600 hover:bg-gray-200'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID PRODUSE */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity duration-200"
          style={{ opacity: fading ? 0 : 1 }}
        >
          {menuData[activeTab].map((item) => (
            <div
              key={item.name}
              className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              {/* IMAGINE */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              {/* TEXT */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-base font-bold text-stone-900">{item.name}</h3>
                  <span className="text-amber-600 font-bold text-base whitespace-nowrap ml-2">
                    {item.price} RON
                  </span>
                </div>
                <p className="text-stone-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
