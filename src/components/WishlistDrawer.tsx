import React from 'react';
import { X, Trash2, MessageCircle } from 'lucide-react';
import { ClothingItem, CatalogSettings } from '../types/clothing';
import { formatARS } from '../utils/formatCurrency';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  clothes: ClothingItem[];
  onRemoveItem: (id: string) => void;
  onQuickView: (item: ClothingItem) => void;
  settings: CatalogSettings;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  clothes,
  onRemoveItem,
  onQuickView,
  settings,
}) => {
  if (!isOpen) return null;

  const wishlistedItems = clothes.filter((item) => wishlistIds.includes(item.id));
  const totalPrice = wishlistedItems.reduce((acc, item) => acc + item.price, 0);
  const formattedTotal = formatARS(totalPrice);

  const generateWhatsAppCheckout = () => {
    const phone = settings.contactWhatsApp || '+34600000000';
    const itemsList = wishlistedItems.map((item, idx) => `${idx + 1}. ${item.name} (${formatARS(item.price)})`).join('\n');
    const text = `Hola ${settings.storeName || 'Atelier Minimal'}, deseo consultar disponibilidad para mi selección de prendas:\n\n${itemsList}\n\nTotal estimado: ${formattedTotal}\n¿Cómo realizo el pago y envío?`;
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#e5e2da] flex items-center justify-between bg-[#faf9f6]">
          <div>
            <h3 className="font-editorial text-2xl font-normal text-[#1a1a1a]">
              Prendas Guardadas
            </h3>
            <span className="text-xs text-[#736f64]">
              {wishlistedItems.length} {wishlistedItems.length === 1 ? 'artículo' : 'artículos'} en tu selección
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#6b675c] hover:text-[#1a1a1a] hover:bg-[#edeae1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#f0ede6]">
          {wishlistedItems.length === 0 ? (
            <div className="text-center py-16 text-[#8c887b]">
              <p className="font-editorial text-xl mb-1 text-[#3b3830]">Tu selección está vacía</p>
              <p className="text-xs max-w-xs mx-auto">
                Guarda tus piezas favoritas haciendo clic en el corazón de cualquier tarjeta de prenda.
              </p>
            </div>
          ) : (
            wishlistedItems.map((item) => {
              const formattedPrice = formatARS(item.price);
              return (
                <div key={item.id} className="py-4 flex gap-4 items-center">
                  <div 
                    className="w-16 h-20 rounded-lg overflow-hidden bg-[#f0ede6] flex-shrink-0 cursor-pointer border border-[#e5e2da]"
                    onClick={() => { onClose(); onQuickView(item); }}
                  >
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-[#858073]">
                      {item.category}
                    </span>
                    <h4 
                      onClick={() => { onClose(); onQuickView(item); }}
                      className="text-sm font-medium text-[#1a1a1a] truncate cursor-pointer hover:text-[#5e4b3c]"
                    >
                      {item.name}
                    </h4>
                    <span className="font-editorial text-base font-semibold text-[#1a1a1a] block mt-0.5">
                      {formatARS(item.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-[#999486] hover:text-[#9e3a24] transition-colors"
                    title="Eliminar de guardados"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Total and WhatsApp Action */}
        {wishlistedItems.length > 0 && (
          <div className="p-5 border-t border-[#e5e2da] bg-[#faf9f6] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#635f54] font-medium">
                Total Estimado
              </span>
              <span className="font-editorial text-2xl font-bold text-[#1a1a1a]">
                {formattedTotal}
              </span>
            </div>

            <a
              href={generateWhatsAppCheckout()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#33312e] text-white py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest font-medium transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Solicitar Selección por WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
