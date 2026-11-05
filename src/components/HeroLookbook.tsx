import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';

interface HeroLookbookProps {
  onExploreClick: () => void;
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const HeroLookbook: React.FC<HeroLookbookProps> = ({
  onExploreClick,
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#faf9f6] border-b border-[#e5e2da]">
      {/* Background Subtle Gradient & Texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5f3ec] to-[#faf9f6] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & Editorial Manifesto */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#edeae1] rounded-full text-[11px] tracking-[0.25em] text-[#6d685c] uppercase font-medium">
              <Sparkles className="w-3 h-3 text-[#99734e]" />
              <span>Colección Atemporal • Temporada 2026</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-light text-[#1a1a1a] leading-[1.08] tracking-tight">
              Prendas esenciales con <span className="italic font-normal text-[#5e4b3c]">pureza de líneas</span> y precios transparentes.
            </h1>

            <p className="text-base sm:text-lg text-[#615d53] max-w-xl font-light leading-relaxed">
              Una galería curada donde el diseño escandinavo y la sastrería clásica se encuentran. 
              Fibras orgánicas, acabados artesanales y una estructura de precios honesta pensada para perdurar.
            </p>

            {/* CTA & Category Quick Links */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2.5 bg-[#1a1a1a] hover:bg-[#33312e] text-[#f4f2eb] px-7 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all shadow-sm hover:shadow active:scale-95"
              >
                <span>Explorar Galería</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2 text-xs text-[#736f64]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8b5a2b]" />
                <span>Base de datos en vivo sincronizada con Firebase</span>
              </div>
            </div>

            {/* Quick Category Badges */}
            <div className="pt-4 flex flex-wrap gap-2">
              <span className="text-xs uppercase tracking-widest text-[#8c887b] mr-1 self-center">
                Categorías:
              </span>
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    onExploreClick();
                  }}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    activeCategory === cat
                      ? 'bg-[#1a1a1a] text-white'
                      : 'bg-[#eeece3] text-[#4d493f] hover:bg-[#dedbd0]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Image Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Primary Featured Portrait */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-xl bg-[#edeae1]">
                <img
                  src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=85"
                  alt="Prendas de alta gama Atelier Minimal"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                
                {/* Image Overlay Label */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#d2bba0] block">
                    Selección Editorial
                  </span>
                  <p className="font-editorial text-2xl font-normal leading-snug">
                    Blazer Sastrería Crema
                  </p>
                  <p className="text-xs font-light text-white/80 mt-0.5">
                    100% Lana Virgen & Seda Italiana
                  </p>
                </div>
              </div>

              {/* Secondary Floating Floating Accent Card */}
              <div className="hidden sm:block absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-[#e8e6dc] max-w-[210px]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 rounded-lg overflow-hidden bg-[#eeece3] flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=300&q=80" 
                      alt="Trench coat" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#8b5a2b] font-semibold block">
                      Enfoque Sostenible
                    </span>
                    <p className="text-xs font-medium text-[#1a1a1a] leading-tight">
                      Materiales 100% Nobles
                    </p>
                    <span className="text-[10px] text-[#736f64]">
                      Longevidad estética
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
