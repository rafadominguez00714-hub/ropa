import React, { useState, useEffect, useMemo } from 'react';
import { 
  Filter, 
  ArrowUpDown, 
  Sparkles, 
  SlidersHorizontal, 
  Search, 
  Grid3X3, 
  LayoutGrid, 
  RefreshCw, 
  Tag, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Plus
} from 'lucide-react';
import { ClothingItem, CatalogSettings, SortOption } from './types/clothing';
import { DEFAULT_CLOTHES } from './data/defaultCatalog';
import { 
  subscribeToClothes, 
  getStoreSettings, 
  seedInitialCatalog, 
  testConnection 
} from './firebase/config';
import { Navbar } from './components/Navbar';
import { HeroLookbook } from './components/HeroLookbook';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { Footer } from './components/Footer';

export default function App() {
  // Clothing items from Firebase Firestore with instant local cache
  const [clothes, setClothes] = useState<ClothingItem[]>(() => {
    try {
      const cached = localStorage.getItem('atelier_clothes_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_CLOTHES;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [isSeedingDefault, setIsSeedingDefault] = useState(false);

  // Store Settings (Default in ARS Pesos Argentinos)
  const [settings, setSettings] = useState<CatalogSettings>(() => {
    try {
      const cached = localStorage.getItem('atelier_settings_cache');
      if (cached) return JSON.parse(cached);
    } catch {
      // fallback
    }
    return {
      storeName: 'ATELIER MINIMAL',
      currency: 'ARS',
      announcement: 'Envío express de cortesía en compras superiores a $ 100.000 • Temporada 2026',
      contactWhatsApp: '+5491100000000',
    };
  });

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [filterSaleOnly, setFilterSaleOnly] = useState(false);
  const [filterInStockOnly, setFilterInStockOnly] = useState(false);
  const [gridColumns, setGridColumns] = useState<3 | 4>(3);

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<ClothingItem | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [adminPreselectedItem, setAdminPreselectedItem] = useState<ClothingItem | null>(null);

  // Wishlist persisted in localStorage
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('atelier_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  // Subscribe to real-time clothes collection from Firestore
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupFirebaseSubscription = async () => {
      try {
        const connected = await testConnection();
        setIsFirebaseConnected(connected);

        // Fetch settings
        const loadedSettings = await getStoreSettings();
        if (loadedSettings) {
          setSettings(loadedSettings);
          try {
            localStorage.setItem('atelier_settings_cache', JSON.stringify(loadedSettings));
          } catch {}
        }

        // Real-time listener
        unsubscribe = subscribeToClothes(
          (items) => {
            if (items.length > 0) {
              setClothes(items);
              try {
                localStorage.setItem('atelier_clothes_cache', JSON.stringify(items));
              } catch {}
            } else {
              setClothes(DEFAULT_CLOTHES);
            }
            setIsLoading(false);
            setIsFirebaseConnected(true);
          },
          (error) => {
            console.warn('Fallback to local default catalog due to Firestore read error:', error);
            setIsLoading(false);
          }
        );
      } catch (err) {
        console.error('Failed to init Firebase:', err);
        setClothes(DEFAULT_CLOTHES);
        setIsLoading(false);
      }
    };

    setupFirebaseSubscription();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // One-click seed trigger
  const handleSeedDatabase = async () => {
    setIsSeedingDefault(true);
    try {
      await seedInitialCatalog();
      setIsFirebaseConnected(true);
    } catch (error) {
      console.error("Error seeding initial catalog:", error);
    } finally {
      setIsSeedingDefault(false);
    }
  };

  // Toggle item in Wishlist
  const handleToggleWishlist = (id: string) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Extract all categories dynamically from clothes
  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    clothes.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return ['Todos', ...Array.from(cats)];
  }, [clothes]);

  // Featured pieces for the spotlight section
  const featuredPieces = useMemo(() => {
    return clothes.filter((item) => item.featured).slice(0, 3);
  }, [clothes]);

  // Filtered & Sorted items
  const filteredClothes = useMemo(() => {
    let result = [...clothes];

    // Category filter
    if (activeCategory !== 'Todos') {
      result = result.filter((item) => item.category === activeCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.materials && item.materials.toLowerCase().includes(q)) ||
          (item.tag && item.tag.toLowerCase().includes(q))
      );
    }

    // Sale filter
    if (filterSaleOnly) {
      result = result.filter((item) => item.originalPrice && item.originalPrice > item.price);
    }

    // In Stock filter
    if (filterInStockOnly) {
      result = result.filter((item) => item.stockStatus !== 'out_of_stock');
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    } else {
      // featured first
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [clothes, activeCategory, searchQuery, filterSaleOnly, filterInStockOnly, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-[#1a1a1a]">
      
      {/* Navigation Header */}
      <Navbar
        settings={settings}
        onOpenAdmin={() => { setAdminPreselectedItem(null); setIsAdminOpen(true); }}
        wishlistCount={wishlistIds.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isFirebaseConnected={isFirebaseConnected}
        clothesCount={clothes.length}
      />

      {/* Hero Lookbook Section */}
      <HeroLookbook
        onExploreClick={() => {
          const el = document.getElementById('galeria');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        categories={allCategories.filter(c => c !== 'Todos')}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full space-y-16">
        
        {/* Curated Editorial Spotlight (Lookbook) */}
        {featuredPieces.length > 0 && activeCategory === 'Todos' && !searchQuery && (
          <section id="destacados" className="space-y-6">
            <div className="flex items-end justify-between border-b border-[#e5e2da] pb-4">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#858073] font-medium block">
                  Curaduría de Temporada
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1a1a1a] mt-1">
                  Piezas Destacadas
                </h2>
              </div>
              <span className="text-xs text-[#736f64] font-light hidden sm:block">
                Ediciones numeradas y tejidos puros
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {featuredPieces.map((piece) => (
                <ProductCard
                  key={piece.id}
                  item={piece}
                  onQuickView={setSelectedProduct}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={wishlistIds.includes(piece.id)}
                  isAdminMode={true}
                  onQuickEditPrice={(item) => {
                    setAdminPreselectedItem(item);
                    setIsAdminOpen(true);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Clothing Catalog & Image Gallery */}
        <section id="galeria" className="space-y-8 scroll-mt-24">
          
          {/* Header & Filter Controls Bar */}
          <div className="flex flex-col space-y-4 border-b border-[#e5e2da] pb-6">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#858073] font-medium block">
                  Galería & Precios
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1a1a1a] mt-1">
                  {activeCategory === 'Todos' ? 'Catálogo Completo' : activeCategory}
                </h2>
              </div>

              {/* View & Search indicators */}
              <div className="flex items-center gap-3 self-start md:self-auto">
                <span className="text-xs text-[#736f64]">
                  {filteredClothes.length} {filteredClothes.length === 1 ? 'prenda' : 'prendas'} encontradas
                </span>

                {/* Grid Density Switcher */}
                <div className="hidden sm:flex items-center bg-[#f0ede6] rounded-lg p-0.5 border border-[#dedbd0]">
                  <button
                    onClick={() => setGridColumns(3)}
                    className={`p-1.5 rounded transition-all ${gridColumns === 3 ? 'bg-white shadow-xs text-[#1a1a1a]' : 'text-[#736f64] hover:text-[#1a1a1a]'}`}
                    title="Vista editorial (3 columnas)"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGridColumns(4)}
                    className={`p-1.5 rounded transition-all ${gridColumns === 4 ? 'bg-white shadow-xs text-[#1a1a1a]' : 'text-[#736f64] hover:text-[#1a1a1a]'}`}
                    title="Vista compacta (4 columnas)"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                </div>

                {/* Admin Quick Add shortcut */}
                <button
                  onClick={() => {
                    setAdminPreselectedItem(null);
                    setIsAdminOpen(true);
                  }}
                  className="flex items-center gap-1.5 text-xs bg-[#1a1a1a] hover:bg-[#33312e] text-[#f7f6f2] px-3 py-1.5 rounded-full transition-all"
                  title="Añadir nueva prenda al catálogo en Firebase"
                >
                  <Plus className="w-3.5 h-3.5 text-[#d2bba0]" />
                  <span className="hidden sm:inline">Añadir Prenda</span>
                </button>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
              {allCategories.map((cat) => {
                const isSelected = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-xs px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all uppercase tracking-wider ${
                      isSelected
                        ? 'bg-[#1a1a1a] text-white shadow-xs'
                        : 'bg-[#eeece3] text-[#5e5a4f] hover:bg-[#dedbd0]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Sub-Filters: Sort By, Sale only, In Stock only */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-[#5e5a4f]">
              <div className="flex flex-wrap items-center gap-3">
                {/* Sale Toggle */}
                <button
                  onClick={() => setFilterSaleOnly(!filterSaleOnly)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                    filterSaleOnly
                      ? 'bg-[#9e3a24] text-white border-[#9e3a24]'
                      : 'bg-white border-[#dcd9ce] hover:border-[#1a1a1a]'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  <span>En Rebajas</span>
                </button>

                {/* In Stock Toggle */}
                <button
                  onClick={() => setFilterInStockOnly(!filterInStockOnly)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                    filterInStockOnly
                      ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                      : 'bg-white border-[#dcd9ce] hover:border-[#1a1a1a]'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Solo con Stock</span>
                </button>

                {/* Reset Filters if active */}
                {(filterSaleOnly || filterInStockOnly || searchQuery || activeCategory !== 'Todos') && (
                  <button
                    onClick={() => {
                      setFilterSaleOnly(false);
                      setFilterInStockOnly(false);
                      setSearchQuery('');
                      setActiveCategory('Todos');
                    }}
                    className="text-[#8c887b] hover:text-[#1a1a1a] underline underline-offset-4"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#8c887b]" />
                <span className="text-[#8c887b]">Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-white border border-[#dedbd0] text-[#1a1a1a] px-3 py-1.5 rounded-full outline-none text-xs cursor-pointer tracking-wider"
                >
                  <option value="featured">Destacados</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="name">Alfabético (A-Z)</option>
                  <option value="newest">Más Recientes</option>
                </select>
              </div>
            </div>

          </div>

          {/* Product Gallery Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-12">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="aspect-[3/4] bg-[#f0ede6] animate-pulse rounded-xl" />
              ))}
            </div>
          ) : filteredClothes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#dedbd0] p-8 space-y-4">
              <Search className="w-10 h-10 text-[#a8a395] mx-auto" />
              <h3 className="font-editorial text-2xl text-[#1a1a1a]">
                No encontramos prendas con esos criterios
              </h3>
              <p className="text-xs text-[#736f64] max-w-sm mx-auto leading-relaxed">
                Prueba a ajustar tus filtros de búsqueda o categoría para explorar las piezas de la colección.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('Todos');
                  setSearchQuery('');
                  setFilterSaleOnly(false);
                  setFilterInStockOnly(false);
                }}
                className="bg-[#1a1a1a] text-white text-xs px-5 py-2.5 rounded-full uppercase tracking-wider font-medium hover:bg-[#33312e] transition-colors"
              >
                Ver Todo el Catálogo
              </button>
            </div>
          ) : (
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${
              gridColumns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
            } gap-6 sm:gap-8`}>
              {filteredClothes.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onQuickView={setSelectedProduct}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={wishlistIds.includes(item.id)}
                  isAdminMode={true}
                  onQuickEditPrice={(piece) => {
                    setAdminPreselectedItem(piece);
                    setIsAdminOpen(true);
                  }}
                />
              ))}
            </div>
          )}

        </section>

        {/* Minimalist Lookbook Editorial Quote Section */}
        <section id="lookbook" className="bg-[#f2efe6] rounded-2xl p-8 sm:p-14 border border-[#e5e2da] text-center max-w-4xl mx-auto space-y-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8b5a2b] font-semibold block">
            Filosofía de Taller
          </span>
          <blockquote className="font-editorial text-2xl sm:text-4xl text-[#1a1a1a] font-normal leading-snug italic max-w-2xl mx-auto">
            "La verdadera elegancia radica en suprimir lo innecesario para dejar que la materia y la forma hablen por sí mismas."
          </blockquote>
          <p className="text-xs text-[#736f64] tracking-widest uppercase">
            Atelier Minimal • Catálogo Exclusivo • Conexión Firestore en Vivo
          </p>
        </section>

      </main>

      {/* Floating Admin Button for instant access */}
      <button
        onClick={() => {
          setAdminPreselectedItem(null);
          setIsAdminOpen(true);
        }}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#33312e] text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all active:scale-95 border border-[#444]"
        title="Abrir Panel Administrativo para agregar ropa o editar precios en Firebase"
      >
        <SlidersHorizontal className="w-4 h-4 text-[#d2bba0]" />
        <span className="text-xs uppercase tracking-wider font-medium">Panel Admin</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>

      {/* Product Detail Modal */}
      <ProductDetailModal
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        settings={settings}
        onOpenAdminEdit={(piece) => {
          setSelectedProduct(null);
          setAdminPreselectedItem(piece);
          setIsAdminOpen(true);
        }}
      />

      {/* Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          setAdminPreselectedItem(null);
        }}
        clothes={clothes}
        settings={settings}
        onUpdateSettings={setSettings}
        isFirebaseConnected={isFirebaseConnected}
        preSelectedEditItem={adminPreselectedItem}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlistIds}
        clothes={clothes}
        onRemoveItem={handleToggleWishlist}
        onQuickView={setSelectedProduct}
        settings={settings}
      />

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => {
          setAdminPreselectedItem(null);
          setIsAdminOpen(true);
        }}
      />

    </div>
  );
}
