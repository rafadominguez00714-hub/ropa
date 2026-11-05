import React, { useState } from 'react';
import { Eye, Heart, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
import { ClothingItem } from '../types/clothing';
import { formatARS } from '../utils/formatCurrency';

interface ProductCardProps {
  item: ClothingItem;
  onQuickView: (item: ClothingItem) => void;
  onToggleWishlist: (id: string) => void;
  isWishlisted: boolean;
  onQuickEditPrice?: (item: ClothingItem) => void;
  isAdminMode?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  onQuickView,
  onToggleWishlist,
  isWishlisted,
  onQuickEditPrice,
  isAdminMode,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Fallback image if list is empty
  const images = item.images && item.images.length > 0 
    ? item.images 
    : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'];

  const formattedPrice = formatARS(item.price);
  const formattedOriginalPrice = item.originalPrice ? formatARS(item.originalPrice) : null;

  const discountPercent = item.originalPrice && item.originalPrice > item.price
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : null;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-[#eae7de] hover:border-[#cfcbc0] transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Gallery Viewport */}
      <div 
        className="relative aspect-[3/4] bg-[#f2efe6] overflow-hidden cursor-pointer"
        onClick={() => onQuickView(item)}
      >
        <img
          src={images[activeImageIndex]}
          alt={item.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
          decoding="async"
        />

        {/* Top Badges & Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {item.tag && (
            <span className={`text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-sm font-semibold shadow-xs ${
              item.tag.toLowerCase().includes('rebaj') 
                ? 'bg-[#9e3a24] text-white' 
                : item.tag.toLowerCase().includes('nuevo')
                ? 'bg-[#1a1a1a] text-white'
                : 'bg-[#d2bba0] text-[#1a1a1a]'
            }`}>
              {item.tag}
            </span>
          )}

          {discountPercent && (
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-sm bg-[#9e3a24] text-white self-start">
              -{discountPercent}%
            </span>
          )}

          {item.stockStatus === 'low_stock' && (
            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm bg-amber-500/90 text-white self-start font-medium backdrop-blur-xs">
              Últimas Unidades
            </span>
          )}
          {item.stockStatus === 'out_of_stock' && (
            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm bg-stone-700 text-white self-start font-medium">
              Agotado temporalmente
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(item.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 ${
            isWishlisted
              ? 'bg-[#8b5a2b] text-white scale-110 shadow'
              : 'bg-white/80 backdrop-blur-xs text-[#524e43] hover:text-[#1a1a1a] hover:bg-white shadow-xs'
          }`}
          aria-label="Guardar en favoritos"
          title={isWishlisted ? "Quitar de favoritos" : "Guardar en favoritos"}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Multiple Images Navigation Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className={`absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 text-[#1a1a1a] flex items-center justify-center transition-opacity shadow-sm hover:bg-white ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              title="Imagen anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 text-[#1a1a1a] flex items-center justify-center transition-opacity shadow-sm hover:bg-white ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              title="Siguiente imagen"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(idx);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    activeImageIndex === idx
                      ? 'w-4 bg-white shadow-sm'
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Ver foto ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Hover Action Overlay: Quick View */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(item);
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white/95 hover:bg-white text-[#1a1a1a] rounded-lg text-xs font-medium tracking-wide uppercase transition-all active:scale-98 shadow"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Vista Rápida</span>
          </button>
        </div>
      </div>

      {/* Card Information */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Category & Color Dots */}
          <div className="flex items-center justify-between text-[11px] text-[#7d796e] uppercase tracking-wider mb-1">
            <span>{item.category}</span>
            {item.colors && item.colors.length > 0 && (
              <div className="flex items-center -space-x-1" title={item.colors.map(c => c.name).join(', ')}>
                {item.colors.slice(0, 3).map((col, cIdx) => (
                  <span
                    key={cIdx}
                    className="w-2.5 h-2.5 rounded-full border border-white shadow-xs"
                    style={{ backgroundColor: col.hex }}
                  />
                ))}
                {item.colors.length > 3 && (
                  <span className="text-[9px] text-[#8c887b] pl-1.5">
                    +{item.colors.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Garment Title */}
          <h3 
            onClick={() => onQuickView(item)}
            className="font-editorial text-lg sm:text-xl font-normal text-[#1a1a1a] hover:text-[#5e4b3c] cursor-pointer transition-colors leading-snug line-clamp-1"
            title={item.name}
          >
            {item.name}
          </h3>

          {/* Available Sizes preview */}
          {item.sizes && item.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.sizes.map((size) => (
                <span
                  key={size}
                  className="text-[10px] px-1.5 py-0.5 rounded-xs bg-[#f4f2eb] text-[#5e5a4f] border border-[#e5e2d8]"
                >
                  {size}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Admin Quick Edit */}
        <div className="mt-4 pt-3 border-t border-[#f0ede6] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-editorial text-2xl font-semibold text-[#1a1a1a]">
              {formattedPrice}
            </span>
            {formattedOriginalPrice && (
              <span className="text-xs text-[#999486] line-through">
                {formattedOriginalPrice}
              </span>
            )}
          </div>

          {/* Admin shortcut button to quickly edit this item's price */}
          {isAdminMode && onQuickEditPrice && (
            <button
              onClick={() => onQuickEditPrice(item)}
              className="flex items-center gap-1 text-[11px] text-[#8b5a2b] hover:text-[#5e3c1a] font-medium bg-[#f5efe6] px-2 py-1 rounded-md transition-colors"
              title="Editar precio de esta prenda en Firebase"
            >
              <Edit3 className="w-3 h-3" />
              <span>Precio</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
