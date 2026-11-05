import React from 'react';
import { SlidersHorizontal, Search, Heart, Sparkles, Database } from 'lucide-react';
import { CatalogSettings } from '../types/clothing';

interface NavbarProps {
  settings: CatalogSettings;
  onOpenAdmin: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isFirebaseConnected: boolean;
  clothesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenAdmin,
  wishlistCount,
  onOpenWishlist,
  searchQuery,
  onSearchChange,
  isFirebaseConnected,
  clothesCount,
}) => {
  const [showSearch, setShowSearch] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#faf9f6]/90 backdrop-blur-md border-b border-[#e5e2da] transition-all">
      {/* Top Announcement Bar */}
      {settings.announcement && (
        <div className="bg-[#1f1e1d] text-[#f4f2eb] px-4 py-1.5 text-xs text-center font-light tracking-widest uppercase flex items-center justify-center gap-2">
          <Sparkles className="w-3 h-3 text-[#d2bba0]" />
          <span>{settings.announcement}</span>
        </div>
      )}

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Brand Identity */}
          <div className="flex items-baseline space-x-3">
            <a href="#" className="group flex flex-col">
              <span className="font-editorial text-2xl sm:text-3xl tracking-[0.2em] font-normal text-[#1a1a1a] uppercase group-hover:text-[#5e4b3c] transition-colors">
                {settings.storeName || 'ATELIER MINIMAL'}
              </span>
              <span className="text-[9px] tracking-[0.35em] text-[#8c887b] uppercase font-sans -mt-1">
                Catálogo de Moda & Precios
              </span>
            </a>

            {/* Live Firebase Status Indicator */}
            <div 
              className="hidden md:flex items-center gap-1.5 text-[11px] text-[#736f64] bg-[#f1f0ea] px-2.5 py-1 rounded-full border border-[#e0ded5]"
              title={isFirebaseConnected ? "Conectado a Firebase Firestore en tiempo real" : "Conectando con Firestore..."}
            >
              <Database className="w-3 h-3 text-[#5e4b3c]" />
              <span className={`w-1.5 h-1.5 rounded-full ${isFirebaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-medium">{clothesCount} prendas</span>
            </div>
          </div>

          {/* Center: Search input or Quick Links */}
          <div className="hidden lg:flex items-center space-x-8 text-xs uppercase tracking-widest text-[#5a574e]">
            <a href="#galeria" className="hover:text-[#1a1a1a] transition-colors pb-1 border-b border-transparent hover:border-[#1a1a1a]">
              Galería
            </a>
            <a href="#destacados" className="hover:text-[#1a1a1a] transition-colors pb-1 border-b border-transparent hover:border-[#1a1a1a]">
              Destacados
            </a>
            <a href="#lookbook" className="hover:text-[#1a1a1a] transition-colors pb-1 border-b border-transparent hover:border-[#1a1a1a]">
              Lookbook
            </a>
            <a href="#contacto" className="hover:text-[#1a1a1a] transition-colors pb-1 border-b border-transparent hover:border-[#1a1a1a]">
              Atelier
            </a>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Toggle */}
            <div className="relative flex items-center">
              {showSearch ? (
                <div className="flex items-center bg-[#f1f0ea] rounded-full px-3 py-1.5 border border-[#dedbd0] animate-fadeIn">
                  <Search className="w-3.5 h-3.5 text-[#8c887b] mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Buscar prenda, color, lino..."
                    className="bg-transparent text-xs text-[#1a1a1a] outline-none w-36 sm:w-48 placeholder:text-[#999486]"
                    autoFocus
                  />
                  <button 
                    onClick={() => { setShowSearch(false); onSearchChange(''); }}
                    className="text-xs text-[#8c887b] hover:text-[#1a1a1a] ml-1 px-1"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2 text-[#4a473e] hover:text-[#1a1a1a] hover:bg-[#edebe3] rounded-full transition-colors"
                  aria-label="Buscar prendas"
                  title="Buscar prenda"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Currency Indicator (Pesos Argentinos) */}
            <div className="hidden sm:flex items-center text-[11px] font-semibold tracking-wider text-[#6b675c] bg-[#f1f0ea] px-2.5 py-1 rounded-full border border-[#dedbd0]">
              <span>ARS ($)</span>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-[#4a473e] hover:text-[#1a1a1a] hover:bg-[#edebe3] rounded-full transition-colors"
              aria-label="Lista de deseos"
              title="Prendas guardadas"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#8b5a2b] text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Admin Panel Button */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#33312e] text-[#f7f6f2] text-xs px-3.5 py-2 rounded-full font-medium transition-all shadow-sm hover:shadow active:scale-95"
              title="Abrir panel administrativo de Firebase para agregar ropa y editar precios"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#d2bba0]" />
              <span className="hidden sm:inline tracking-wider uppercase text-[11px]">Panel Admin</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
