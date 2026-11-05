import React from 'react';
import { SlidersHorizontal, MessageCircle, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';
import { CatalogSettings } from '../types/clothing';

interface FooterProps {
  settings: CatalogSettings;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  return (
    <footer id="contacto" className="bg-[#1f1e1d] text-[#e8e5dc] pt-16 pb-12 border-t border-[#33312e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 3 Pillar Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-14 border-b border-[#33312e] text-center md:text-left">
          <div className="space-y-2">
            <div className="inline-flex p-2.5 rounded-full bg-[#2d2b28] text-[#d2bba0] mb-1">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-editorial text-lg text-white font-normal">
              Fibras Puras & Confección Lenta
            </h4>
            <p className="text-xs text-[#9c978b] leading-relaxed">
              Seleccionamos exclusivamente linos certificados, sedas morera y lanas vírgenes procesadas bajo estándares éticos.
            </p>
          </div>

          <div className="space-y-2">
            <div className="inline-flex p-2.5 rounded-full bg-[#2d2b28] text-[#d2bba0] mb-1">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-editorial text-lg text-white font-normal">
              Precios Transparentes
            </h4>
            <p className="text-xs text-[#9c978b] leading-relaxed">
              Desglose honesto sin intermediarios superfluos ni sobreproducción masiva. Valor genuino que permanece en el tiempo.
            </p>
          </div>

          <div className="space-y-2">
            <div className="inline-flex p-2.5 rounded-full bg-[#2d2b28] text-[#d2bba0] mb-1">
              <MessageCircle className="w-4 h-4" />
            </div>
            <h4 className="font-editorial text-lg text-white font-normal">
              Atención Personalizada
            </h4>
            <p className="text-xs text-[#9c978b] leading-relaxed">
              Asesoría de estilo y confirmación de medidas en directo a través de nuestra línea de WhatsApp boutique.
            </p>
          </div>
        </div>

        {/* Main Footer Links & Branding */}
        <div className="pt-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          <div className="md:col-span-6 space-y-4">
            <span className="font-editorial text-2xl tracking-[0.2em] uppercase font-normal text-white">
              {settings.storeName || 'ATELIER MINIMAL'}
            </span>
            <p className="text-xs text-[#9c978b] max-w-sm leading-relaxed">
              Plataforma digital de presentación de colecciones de moda y catálogo interactivo sincronizado en tiempo real con Firebase Firestore.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a 
                href={settings.contactWhatsApp ? `https://wa.me/${settings.contactWhatsApp.replace(/[^0-9]/g, '')}` : '#'}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#d2bba0] hover:text-white transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Contactar Atelier</span>
              </a>
            </div>
          </div>

          <div className="md:col-span-3 space-y-2 text-xs text-[#9c978b]">
            <h5 className="uppercase tracking-widest text-white text-[11px] font-semibold mb-2">
              Navegación
            </h5>
            <p><a href="#galeria" className="hover:text-white transition-colors">Colección Completa</a></p>
            <p><a href="#destacados" className="hover:text-white transition-colors">Piezas Destacadas</a></p>
            <p><a href="#lookbook" className="hover:text-white transition-colors">Manifiesto Estético</a></p>
          </div>

          <div className="md:col-span-3 space-y-3 text-xs text-[#9c978b]">
            <h5 className="uppercase tracking-widest text-white text-[11px] font-semibold mb-2">
              Administración
            </h5>
            <p className="text-[11px]">
              Panel de control para añadir prendas y actualizar precios al instante.
            </p>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 bg-[#2d2b28] hover:bg-[#3d3a36] text-[#d2bba0] hover:text-white px-3.5 py-2 rounded-lg text-xs font-medium transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Acceso Panel Admin</span>
            </button>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="mt-12 pt-8 border-t border-[#33312e] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#736f64] gap-4">
          <p>© 2026 {settings.storeName || 'Atelier Minimal'}. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Base de datos: Firebase Firestore</span>
            <span>•</span>
            <button onClick={onOpenAdmin} className="hover:text-[#d2bba0] transition-colors">
              Modo Administrador
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
