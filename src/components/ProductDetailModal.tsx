import React, { useState } from 'react';
import { X, Heart, MessageCircle, Share2, Check, ShieldCheck, Sparkles, Edit3 } from 'lucide-react';
import { ClothingItem, CatalogSettings } from '../types/clothing';
import { formatARS } from '../utils/formatCurrency';

interface ProductDetailModalProps {
  item: ClothingItem | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  settings: CatalogSettings;
  onOpenAdminEdit?: (item: ClothingItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  onClose,
  isWishlisted,
  onToggleWishlist,
  settings,
  onOpenAdminEdit,
}) => {
  if (!item) return null;

  const images = item.images && item.images.length > 0
    ? item.images
    : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80'];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [selectedSize, setSelectedSize] = useState<string>(item.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(item.colors?.[0]?.name || '');
  const [copiedLink, setCopiedLink] = useState(false);

  const formattedPrice = formatARS(item.price);
  const formattedOriginalPrice = item.originalPrice ? formatARS(item.originalPrice) : null;

  const discountPercent = item.originalPrice && item.originalPrice > item.price
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const generateWhatsAppUrl = () => {
    const phone = settings.contactWhatsApp || '+34600000000';
    const text = `Hola ${settings.storeName || 'Atelier Minimal'}, me interesa la prenda "${item.name}" (${formattedPrice}).
Talla preferida: ${selectedSize || 'Estándar'}
Color: ${selectedColor || 'Original'}
¿Tienen disponibilidad para entrega o envío?`;
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#e8e5dc] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Modal Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 text-[#4a473e] hover:text-[#1a1a1a] hover:bg-white shadow transition-all"
          aria-label="Cerrar detalle"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
          
          {/* Left Column: Gallery Images & Thumbnails */}
          <div className="md:col-span-6 bg-[#f7f5ef] p-4 sm:p-6 flex flex-col justify-between">
            {/* Primary Main Image with Zoom container */}
            <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-white shadow-xs relative">
              <img
                src={selectedImage}
                alt={item.name}
                className="w-full h-full object-cover object-center"
              />
              {item.tag && (
                <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded bg-[#1a1a1a] text-white font-semibold">
                  {item.tag}
                </span>
              )}
            </div>

            {/* Thumbnail Selectors if multiple images exist */}
            {images.length > 1 && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img
                        ? 'border-[#1a1a1a] scale-102 shadow-xs'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${item.name} thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Garment Specifications & Actions */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-5">
              
              {/* Category & Status */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.25em] text-[#858073] font-medium">
                  {item.category}
                </span>
                
                {/* Stock status pill */}
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  {item.stockStatus === 'in_stock' && (
                    <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ● Disponible en stock
                    </span>
                  )}
                  {item.stockStatus === 'low_stock' && (
                    <span className="text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      ● Pocas unidades restantes
                    </span>
                  )}
                  {item.stockStatus === 'out_of_stock' && (
                    <span className="text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-300">
                      ● Agotado
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Price */}
              <div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-[#1a1a1a] leading-tight">
                  {item.name}
                </h2>

                <div className="flex items-baseline gap-3 mt-3">
                  <span className="font-editorial text-3xl font-semibold text-[#1a1a1a]">
                    {formattedPrice}
                  </span>
                  {formattedOriginalPrice && (
                    <span className="text-sm text-[#8c887b] line-through">
                      {formattedOriginalPrice}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#9e3a24] text-white">
                      Ahorra {discountPercent}%
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#545147] font-light leading-relaxed">
                {item.description}
              </p>

              {/* Material Composition */}
              {item.materials && (
                <div className="p-3 bg-[#f8f7f2] rounded-lg border border-[#e8e6dc] text-xs space-y-1">
                  <span className="font-semibold text-[#3b3830] tracking-wide uppercase text-[10px] block">
                    Composición & Materiales:
                  </span>
                  <span className="text-[#635f54] leading-relaxed block">
                    {item.materials}
                  </span>
                </div>
              )}

              {/* Color Selection */}
              {item.colors && item.colors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#524e43]">
                    <span className="font-medium">Color:</span>
                    <span className="font-normal text-[#807b70]">{selectedColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all ${
                          selectedColor === color.name
                            ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                            : 'border-[#dedbd0] bg-[#faf9f6] text-[#3e3b33] hover:border-[#aaa79c]'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-white/50"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {item.sizes && item.sizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#524e43]">
                    <span className="font-medium">Talla disponible:</span>
                    <span className="text-[#807b70]">Guía estándar europea</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-10 h-10 px-3 rounded-lg text-xs font-medium uppercase border transition-all ${
                          selectedSize === size
                            ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-xs'
                            : 'bg-white text-[#4a473e] border-[#d8d5ca] hover:border-[#1a1a1a]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Actions Bottom Bar */}
            <div className="mt-8 pt-5 border-t border-[#e8e6dc] space-y-3">
              <div className="flex gap-2">
                {/* WhatsApp Direct Order / Consultation Button */}
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#33312e] text-white py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest font-medium transition-all shadow-sm hover:shadow"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Consultar por WhatsApp</span>
                </a>

                {/* Wishlist Button */}
                <button
                  onClick={() => onToggleWishlist(item.id)}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isWishlisted
                      ? 'bg-[#8b5a2b] text-white border-[#8b5a2b]'
                      : 'bg-[#faf9f6] text-[#4d493f] border-[#d8d5ca] hover:border-[#1a1a1a]'
                  }`}
                  title={isWishlisted ? "Quitar de favoritos" : "Guardar en favoritos"}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                {/* Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  className="p-3.5 rounded-xl bg-[#faf9f6] text-[#4d493f] border border-[#d8d5ca] hover:border-[#1a1a1a] transition-all"
                  title="Copiar enlace de esta prenda"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Admin shortcut edit */}
              {onOpenAdminEdit && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdminEdit(item);
                    }}
                    className="flex items-center gap-1.5 text-xs text-[#8b5a2b] hover:text-[#5e3c1a] font-medium transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar esta prenda y precio en Firebase</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
