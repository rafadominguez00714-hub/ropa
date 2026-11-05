import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  Database, 
  Image as ImageIcon, 
  Tag, 
  Layers, 
  DollarSign, 
  AlertCircle, 
  RefreshCw, 
  Sliders, 
  Save, 
  Sparkles,
  LogIn,
  LogOut,
  ExternalLink,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { ClothingItem, CatalogSettings, StockStatus } from '../types/clothing';
import { PRESET_FASHION_IMAGES } from '../data/presetImages';
import { ADMIN_PASSWORD } from '../config/adminSecurity';
import { formatARS } from '../utils/formatCurrency';
import { 
  addClothingItem, 
  updateClothingItem, 
  deleteClothingItem, 
  seedInitialCatalog, 
  saveStoreSettings,
  auth,
  loginWithGoogle,
  logoutUser
} from '../firebase/config';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  clothes: ClothingItem[];
  settings: CatalogSettings;
  onUpdateSettings: (newSettings: CatalogSettings) => void;
  isFirebaseConnected: boolean;
  preSelectedEditItem?: ClothingItem | null;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  clothes,
  settings,
  onUpdateSettings,
  isFirebaseConnected,
  preSelectedEditItem,
}) => {
  if (!isOpen) return null;

  // Password Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('atelier_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [showPasswordText, setShowPasswordText] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('atelier_admin_auth', 'true');
      setAuthError(false);
      setPasswordInput('');
    } else {
      setAuthError(true);
    }
  };

  const handleLockAdmin = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('atelier_admin_auth');
  };

  const [activeTab, setActiveTab] = useState<'prices' | 'add' | 'settings'>('prices');
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(preSelectedEditItem || null);

  // Notification state
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inline price edits cache
  const [priceChanges, setPriceChanges] = useState<Record<string, { price: number; originalPrice?: number; stockStatus: StockStatus }>>({});

  // Preset image picker drawer
  const [showPresetPicker, setShowPresetPicker] = useState(false);

  // Initial Form state in Argentine Pesos
  const initialFormState = {
    name: '',
    price: 85000,
    originalPrice: undefined as number | undefined,
    category: 'Camisas & Tops',
    description: '',
    materials: '100% Algodón Orgánico',
    images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80'],
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Blanco Roto', hex: '#F7F6F2' }],
    stockStatus: 'in_stock' as StockStatus,
    featured: false,
    tag: 'NUEVO',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#1a1a1a');

  // Password Lock Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
        <div 
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#dedbd0] p-6 sm:p-8 space-y-6"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#9c978b] hover:text-[#1a1a1a] hover:bg-[#f0ede6] transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2 pt-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1f1e1d] text-[#d2bba0] flex items-center justify-center shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="font-editorial text-2xl font-normal text-[#1a1a1a]">
              Acceso al Panel Admin
            </h2>
            <p className="text-xs text-[#736f64] max-w-xs mx-auto leading-relaxed">
              Área protegida. Ingresa la contraseña de administrador para gestionar las prendas y precios en Firebase.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#4a473e] uppercase tracking-wider block">
                Contraseña de Administrador
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPasswordText ? "text" : "password"}
                  autoFocus
                  required
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(false);
                  }}
                  placeholder="Introduce la contraseña..."
                  className={`w-full px-4 py-2.5 bg-[#faf9f6] border rounded-xl text-sm outline-none transition-all pr-10 ${
                    authError 
                      ? 'border-rose-400 focus:border-rose-600 bg-rose-50/30' 
                      : 'border-[#d8d5ca] focus:border-[#1a1a1a] focus:bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordText(!showPasswordText)}
                  className="absolute right-3 text-[#8c887b] hover:text-[#1a1a1a]"
                  title={showPasswordText ? "Ocultar" : "Mostrar"}
                >
                  {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && (
                <p className="text-xs text-rose-600 font-medium pt-1">
                  Contraseña incorrecta. Inténtalo de nuevo.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#33312e] text-white py-3 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all shadow-sm active:scale-98"
            >
              <KeyRound className="w-4 h-4 text-[#d2bba0]" />
              <span>Ingresar al Panel</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Load editingItem into form when selected
  React.useEffect(() => {
    if (preSelectedEditItem) {
      setEditingItem(preSelectedEditItem);
      setFormData({
        name: preSelectedEditItem.name,
        price: preSelectedEditItem.price,
        originalPrice: preSelectedEditItem.originalPrice,
        category: preSelectedEditItem.category,
        description: preSelectedEditItem.description,
        materials: preSelectedEditItem.materials || '',
        images: preSelectedEditItem.images || [],
        sizes: preSelectedEditItem.sizes || [],
        colors: preSelectedEditItem.colors || [],
        stockStatus: preSelectedEditItem.stockStatus,
        featured: Boolean(preSelectedEditItem.featured),
        tag: preSelectedEditItem.tag || '',
      });
      setActiveTab('add');
    }
  }, [preSelectedEditItem]);

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Google Sign In Handler
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      showFeedback('Sesión iniciada con Google');
    } catch (error: any) {
      showFeedback(`Error al iniciar sesión: ${error.message || 'Intente nuevamente'}`, 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      showFeedback('Sesión cerrada');
    } catch (error) {
      showFeedback('Error al cerrar sesión', 'error');
    }
  };

  // Quick Inline Price Editing Handlers
  const handleInlinePriceChange = (id: string, field: 'price' | 'originalPrice', value: number) => {
    const current = clothes.find(c => c.id === id);
    if (!current) return;

    setPriceChanges(prev => ({
      ...prev,
      [id]: {
        price: field === 'price' ? value : (prev[id]?.price ?? current.price),
        originalPrice: field === 'originalPrice' ? (value > 0 ? value : undefined) : (prev[id]?.originalPrice ?? current.originalPrice),
        stockStatus: prev[id]?.stockStatus ?? current.stockStatus
      }
    }));
  };

  const handleInlineStockChange = (id: string, status: StockStatus) => {
    const current = clothes.find(c => c.id === id);
    if (!current) return;

    setPriceChanges(prev => ({
      ...prev,
      [id]: {
        price: prev[id]?.price ?? current.price,
        originalPrice: prev[id]?.originalPrice ?? current.originalPrice,
        stockStatus: status
      }
    }));
  };

  const handleSaveInlinePrice = async (id: string) => {
    const changes = priceChanges[id];
    if (!changes) return;

    setIsSubmitting(true);
    try {
      await updateClothingItem(id, {
        price: Number(changes.price),
        originalPrice: changes.originalPrice ? Number(changes.originalPrice) : undefined,
        stockStatus: changes.stockStatus
      });
      // Clear from change map
      setPriceChanges(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      showFeedback('Precio actualizado en Firebase');
    } catch (error: any) {
      showFeedback('Error al guardar precio en Firebase', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add or Edit Garment Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.price <= 0) {
      showFeedback('Ingresa un nombre y precio válidos', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateClothingItem(editingItem.id, {
          name: formData.name,
          price: Number(formData.price),
          originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
          category: formData.category,
          description: formData.description,
          materials: formData.materials,
          images: formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80'],
          sizes: formData.sizes,
          colors: formData.colors,
          stockStatus: formData.stockStatus,
          featured: formData.featured,
          tag: formData.tag,
        });
        showFeedback(`Prenda "${formData.name}" actualizada con éxito`);
      } else {
        await addClothingItem({
          name: formData.name,
          price: Number(formData.price),
          originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
          category: formData.category,
          description: formData.description,
          materials: formData.materials,
          images: formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80'],
          sizes: formData.sizes,
          colors: formData.colors,
          stockStatus: formData.stockStatus,
          featured: formData.featured,
          tag: formData.tag,
        });
        showFeedback(`Prenda "${formData.name}" guardada en Firebase`);
      }

      // Reset form
      setFormData(initialFormState);
      setEditingItem(null);
      setActiveTab('prices');
    } catch (error: any) {
      showFeedback(`Error en Firebase: ${error.message || 'Verifica la conexión'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Garment
  const handleDeleteItem = async (id: string, name: string) => {
    if (!window.confirm(`¿Seguro que deseas eliminar "${name}" del catálogo en Firebase?`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteClothingItem(id);
      showFeedback(`Prenda "${name}" eliminada`);
    } catch (error) {
      showFeedback('Error al eliminar prenda', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Seed sample catalog into Firestore
  const handleSeedCatalog = async () => {
    if (!window.confirm('¿Deseas poblar la base de datos de Firebase con el catálogo de ejemplo curado en Pesos Argentinos (8 prendas)?')) {
      return;
    }
    setIsSubmitting(true);
    try {
      const count = await seedInitialCatalog();
      showFeedback(`¡Se crearon ${count} prendas exitosamente en Firebase!`);
    } catch (error) {
      showFeedback('Error al cargar catálogo demo', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle size in form
  const toggleSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  // Add image URL
  const addImageToForm = (url: string) => {
    if (!url.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url.trim()]
    }));
    setNewImageUrl('');
  };

  // Remove image from form
  const removeImageFromForm = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Add color to form
  const addColorToForm = () => {
    if (!newColorName.trim()) return;
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { name: newColorName.trim(), hex: newColorHex }]
    }));
    setNewColorName('');
  };

  const removeColorFromForm = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  // Category presets
  const CATEGORY_PRESETS = [
    'Abrigos & Chaquetas',
    'Camisas & Tops',
    'Pantalones',
    'Vestidos',
    'Accesorios & Calzado',
    'Punto & Cashmere'
  ];

  const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '38', '40', '42', 'Única'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-[#dedbd0] flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="bg-[#1f1e1d] text-[#f7f6f2] px-5 py-4 flex items-center justify-between border-b border-[#33312e]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#33312e] text-[#d2bba0]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-editorial text-xl font-medium tracking-wide">
                  Panel de Administración Firebase
                </h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  isFirebaseConnected 
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {isFirebaseConnected ? 'Firestore Conectado' : 'Conectando...'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2d2b28] text-[#d2bba0] font-medium border border-[#3e3b36]">
                  Moneda: Pesos Argentinos (ARS)
                </span>
              </div>
              <p className="text-[11px] text-[#9c978b]">
                Gestión de prendas, precios en tiempo real y catálogo boutique
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Lock / Exit Admin Session */}
            <button
              onClick={handleLockAdmin}
              className="flex items-center gap-1.5 bg-[#2d2b28] hover:bg-[#3d3a36] text-[#d2bba0] hover:text-white px-3 py-1.5 rounded-lg text-xs transition-colors"
              title="Bloquear panel y requerir contraseña nuevamente"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bloquear</span>
            </button>

            {/* User Auth Info */}
            {auth.currentUser ? (
              <div className="hidden sm:flex items-center gap-2 bg-[#2d2b28] px-3 py-1 rounded-full text-xs">
                <span className="text-[#c7c3b7] text-[11px] truncate max-w-[130px]">
                  {auth.currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-[#d2bba0] hover:text-white"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="hidden sm:flex items-center gap-1.5 bg-[#33312e] hover:bg-[#44413c] text-[#f2efe9] text-xs px-3 py-1.5 rounded-full transition-colors"
                title="Acceder con Google"
              >
                <LogIn className="w-3 h-3 text-[#d2bba0]" />
                <span>Google</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#9c978b] hover:text-white hover:bg-[#33312e] transition-colors"
              aria-label="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {notification && (
          <div className={`px-4 py-2.5 text-xs font-medium flex items-center justify-between transition-all ${
            notification.type === 'success' 
              ? 'bg-emerald-50 text-emerald-900 border-b border-emerald-200' 
              : 'bg-rose-50 text-rose-900 border-b border-rose-200'
          }`}>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-xs opacity-70 hover:opacity-100">
              ✕
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-[#faf9f6] border-b border-[#e5e2da] px-5 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveTab('prices'); setEditingItem(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'prices'
                  ? 'bg-[#1a1a1a] text-white shadow-xs'
                  : 'text-[#5a574e] hover:bg-[#edeae1]'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Editar Precios & Catálogo ({clothes.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('add'); if (!editingItem) setFormData(initialFormState); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'add'
                  ? 'bg-[#1a1a1a] text-white shadow-xs'
                  : 'text-[#5a574e] hover:bg-[#edeae1]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{editingItem ? 'Editando Prenda' : 'Agregar Nueva Prenda'}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#1a1a1a] text-white shadow-xs'
                  : 'text-[#5a574e] hover:bg-[#edeae1]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Ajustes & BD</span>
            </button>
          </div>

          {/* Quick Seed Action if clothes are empty */}
          {clothes.length === 0 && (
            <button
              onClick={handleSeedCatalog}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 text-xs bg-[#8b5a2b] hover:bg-[#704822] text-white px-3.5 py-1.5 rounded-full font-medium transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cargar 8 Prendas de Muestra</span>
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-[#faf9f6]">

          {/* TAB 1: LIST & QUICK INLINE PRICE EDITING */}
          {activeTab === 'prices' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                <div>
                  <h3 className="text-sm font-semibold text-[#1a1a1a] uppercase tracking-wider">
                    Modificación Rápida de Precios
                  </h3>
                  <p className="text-xs text-[#736f64]">
                    Puedes modificar los precios y estados de stock directamente en las casillas. Haz clic en "Guardar" para sincronizar con Firebase.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingItem(null);
                    setFormData(initialFormState);
                    setActiveTab('add');
                  }}
                  className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#33312e] text-white text-xs px-3 py-1.5 rounded-lg self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nueva Prenda</span>
                </button>
              </div>

              {clothes.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[#d2cebe] p-8">
                  <Database className="w-10 h-10 text-[#a8a395] mx-auto mb-3" />
                  <p className="text-sm font-medium text-[#1a1a1a]">No hay prendas cargadas en Firebase</p>
                  <p className="text-xs text-[#736f64] max-w-md mx-auto mt-1 mb-4">
                    La colección de Firestore está vacía. Puedes comenzar agregando una prenda o poblar con el catálogo inicial de demostración.
                  </p>
                  <button
                    onClick={handleSeedCatalog}
                    className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white text-xs px-4 py-2.5 rounded-full font-medium shadow-sm hover:bg-[#33312e]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#d2bba0]" />
                    <span>Cargar Catálogo Inicial de 8 Prendas</span>
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-[#e5e2da] overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f2efe6] text-[#4d493e] uppercase tracking-wider text-[10px] font-semibold border-b border-[#e5e2da]">
                        <tr>
                          <th className="py-3 px-4">Prenda</th>
                          <th className="py-3 px-3">Categoría</th>
                          <th className="py-3 px-3">Precio Actual ($ ARS)</th>
                          <th className="py-3 px-3">Precio Anterior ($ ARS)</th>
                          <th className="py-3 px-3">Estado Stock</th>
                          <th className="py-3 px-4 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ede9df]">
                        {clothes.map((item) => {
                          const currentChanges = priceChanges[item.id];
                          const hasUnsavedChanges = Boolean(currentChanges);
                          const currentPriceVal = currentChanges?.price ?? item.price;
                          const currentOriginalPriceVal = currentChanges?.originalPrice ?? (item.originalPrice || '');
                          const currentStockVal = currentChanges?.stockStatus ?? item.stockStatus;

                          return (
                            <tr key={item.id} className={`hover:bg-[#faf9f6] transition-colors ${hasUnsavedChanges ? 'bg-amber-50/50' : ''}`}>
                              {/* Garment Image + Name */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-12 rounded bg-[#edeae1] overflow-hidden flex-shrink-0 border border-[#dedbd0]">
                                    <img
                                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=150&q=80'}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <span className="font-medium text-[#1a1a1a] block leading-tight">
                                      {item.name}
                                    </span>
                                    {item.tag && (
                                      <span className="text-[9px] uppercase tracking-wider text-[#8b5a2b] font-semibold">
                                        {item.tag}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Category */}
                              <td className="py-3 px-3 text-[#615d52]">
                                <span className="bg-[#f4f2eb] px-2 py-0.5 rounded text-[11px]">
                                  {item.category}
                                </span>
                              </td>

                              {/* Current Price Input */}
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-1">
                                  <span className="text-[#8c887b] font-medium">$</span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="500"
                                    value={currentPriceVal}
                                    onChange={(e) => handleInlinePriceChange(item.id, 'price', Number(e.target.value))}
                                    className="w-28 px-2 py-1 bg-[#faf9f6] border border-[#d8d5ca] rounded text-xs text-[#1a1a1a] font-semibold focus:bg-white focus:border-[#1a1a1a] outline-none"
                                  />
                                </div>
                              </td>

                              {/* Original Price (for sales) Input */}
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-1">
                                  <span className="text-[#8c887b] font-medium">$</span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="500"
                                    placeholder="Opcional"
                                    value={currentOriginalPriceVal}
                                    onChange={(e) => handleInlinePriceChange(item.id, 'originalPrice', Number(e.target.value))}
                                    className="w-28 px-2 py-1 bg-[#faf9f6] border border-[#d8d5ca] rounded text-xs text-[#736f64] focus:bg-white focus:border-[#1a1a1a] outline-none"
                                  />
                                </div>
                              </td>

                              {/* Stock status */}
                              <td className="py-3 px-3">
                                <select
                                  value={currentStockVal}
                                  onChange={(e) => handleInlineStockChange(item.id, e.target.value as StockStatus)}
                                  className="px-2 py-1 bg-[#faf9f6] border border-[#d8d5ca] rounded text-[11px] text-[#33312e] outline-none cursor-pointer"
                                >
                                  <option value="in_stock">En stock</option>
                                  <option value="low_stock">Pocas unidades</option>
                                  <option value="out_of_stock">Agotado</option>
                                </select>
                              </td>

                              {/* Action buttons */}
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Save inline price button if modified */}
                                  {hasUnsavedChanges && (
                                    <button
                                      onClick={() => handleSaveInlinePrice(item.id)}
                                      disabled={isSubmitting}
                                      className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[11px] font-medium shadow-xs animate-bounce"
                                      title="Guardar nuevo precio en Firebase"
                                    >
                                      <Save className="w-3 h-3" />
                                      <span>Guardar</span>
                                    </button>
                                  )}

                                  {/* Edit full details */}
                                  <button
                                    onClick={() => {
                                      setEditingItem(item);
                                      setFormData({
                                        name: item.name,
                                        price: item.price,
                                        originalPrice: item.originalPrice,
                                        category: item.category,
                                        description: item.description,
                                        materials: item.materials || '',
                                        images: item.images || [],
                                        sizes: item.sizes || [],
                                        colors: item.colors || [],
                                        stockStatus: item.stockStatus,
                                        featured: Boolean(item.featured),
                                        tag: item.tag || '',
                                      });
                                      setActiveTab('add');
                                    }}
                                    className="p-1.5 text-[#5e5a4f] hover:text-[#1a1a1a] hover:bg-[#edeae1] rounded transition-colors"
                                    title="Editar todos los detalles de la prenda"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Delete garment */}
                                  <button
                                    onClick={() => handleDeleteItem(item.id, item.name)}
                                    disabled={isSubmitting}
                                    className="p-1.5 text-[#9e3a24] hover:text-white hover:bg-[#9e3a24] rounded transition-colors"
                                    title="Eliminar de Firebase"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADD / EDIT GARMENT FULL FORM */}
          {activeTab === 'add' && (
            <form onSubmit={handleFormSubmit} className="space-y-6 max-w-3xl mx-auto bg-white p-6 rounded-xl border border-[#e5e2da] shadow-xs">
              
              <div className="flex items-center justify-between border-b border-[#f0ede6] pb-3">
                <div>
                  <h3 className="font-editorial text-xl font-normal text-[#1a1a1a]">
                    {editingItem ? `Editar: ${editingItem.name}` : 'Crear Nueva Prenda'}
                  </h3>
                  <p className="text-xs text-[#736f64]">
                    Los datos se guardarán de forma persistente en Firestore.
                  </p>
                </div>

                {editingItem && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      setFormData(initialFormState);
                    }}
                    className="text-xs text-[#8c887b] hover:text-[#1a1a1a]"
                  >
                    Cancelar edición
                  </button>
                )}
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3b3830] uppercase tracking-wider block">
                    Nombre de la Prenda *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej. Blazer de Lino & Seda"
                    className="w-full px-3 py-2 bg-[#faf9f6] border border-[#d8d5ca] rounded-lg text-xs text-[#1a1a1a] focus:bg-white focus:border-[#1a1a1a] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3b3830] uppercase tracking-wider block">
                    Categoría *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Ej. Abrigos & Chaquetas"
                    className="w-full px-3 py-2 bg-[#faf9f6] border border-[#d8d5ca] rounded-lg text-xs text-[#1a1a1a] focus:bg-white focus:border-[#1a1a1a] outline-none"
                  />
                  {/* Category suggestion chips */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {CATEGORY_PRESETS.map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                        className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                          formData.category === cat ? 'bg-[#1a1a1a] text-white' : 'bg-[#f0ede6] text-[#615d52] hover:bg-[#e2dfd4]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing & Stock status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3b3830] uppercase tracking-wider block">
                    Precio Actual ($ ARS) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-[#faf9f6] border border-[#d8d5ca] rounded-lg text-xs text-[#1a1a1a] font-semibold focus:bg-white focus:border-[#1a1a1a] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3b3830] uppercase tracking-wider block">
                    Precio Anterior ($ ARS)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    placeholder="Opcional para rebajas"
                    value={formData.originalPrice ?? ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      originalPrice: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    className="w-full px-3 py-2 bg-[#faf9f6] border border-[#d8d5ca] rounded-lg text-xs text-[#736f64] focus:bg-white focus:border-[#1a1a1a] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3b3830] uppercase tracking-wider block">
                    Estado de Stock *
                  </label>
                  <select
                    value={formData.stockStatus}
                    onChange={(e) => setFormData(prev => ({ ...prev, stockStatus: e.target.value as StockStatus }))}
                    className="w-full px-3 py-2 bg-[#faf9f6] border border-[#d8d5ca] rounded-lg text-xs text-[#1a1a1a] focus:bg-white focus:border-[#1a1a1a] outline-none"
                  >
                    <option value="in_stock">Disponible en Stock</option>
                    <option value="low_stock">Pocas Unidades Restantes</option>
                    <option value="out_of_stock">Agotado Temporalmente</option>
                  </select>
                </div>
              </div>

              {/* Tag & Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3b3830] uppercase tracking-wider block">
                    Etiqueta Promocional
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.tag}
                      onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                      placeholder="Ej. NUEVO, REBAJAS, EDICIÓN LIMITADA"
                      className="w-full px-3 py-2 bg-[#faf9f6] border border-[#d8d5ca] rounded-lg text-xs text-[#1a1a1a] focus:bg-white focus:border-[#1a1a1a] outline-none"
                    />
                    <div className="flex gap-1">
                      {['NUEVO', 'REBAJAS', 'EDICIÓN LIMITADA'].map(tagOption => (
                        <button
                          type="button"
                          key={tagOption}
                          onClick={() => setFormData(prev => ({ ...prev, tag: tagOption }))}
                          className="text-[9px] px-1.5 py-1 bg-[#edeae1] hover:bg-[#dedbd0] rounded text-[#4d493f]"
                        >
                          {tagOption}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#3b3830] font-medium">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-4 h-4 rounded text-[#1a1a1a] focus:ring-0"
                    />
                    <span>Destacar en sección principal del Lookbook</span>
                  </label>
                </div>
              </div>

              {/* Images Management */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#3b3830] uppercase tracking-wider block">
                    Galería de Imágenes ({formData.images.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPresetPicker(!showPresetPicker)}
                    className="flex items-center gap-1.5 text-xs text-[#8b5a2b] hover:text-[#5e3c1a] font-medium"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{showPresetPicker ? 'Cerrar fotos preconfiguradas' : 'Elegir fotos de moda listas'}</span>
                  </button>
                </div>

                {/* Preset image picker grid */}
                {showPresetPicker && (
                  <div className="p-3 bg-[#f5f3ec] rounded-xl border border-[#dedbd0] space-y-2 animate-fadeIn">
                    <p className="text-[11px] text-[#736f64]">
                      Haz clic en cualquier imagen de moda para agregarla inmediatamente a la prenda:
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {PRESET_FASHION_IMAGES.map((preset, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => addImageToForm(preset.url)}
                          className="group relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer border border-[#dedbd0] hover:border-[#1a1a1a] shadow-xs"
                          title={preset.label}
                        >
                          <img src={preset.url} alt={preset.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                            <Plus className="w-4 h-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Current Images list with remove buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {formData.images.map((imgUrl, idx) => (
                    <div key={idx} className="relative w-20 h-24 rounded-lg overflow-hidden border border-[#dedbd0] group">
                      <img src={imgUrl} alt="Previsualización" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImageFromForm(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors"
                        title="Quitar foto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Custom URL input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Pegar URL de imagen (https://...)"
                    className="flex-1 px-3 py-2 bg-[#faf9f6] border border-[#d8d5ca] rounded-lg text-xs text-[#1a1a1a] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => addImageToForm(newImageUrl)}
                    className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-xs font-medium hover:bg-[#33312e]"
                  >
                    Agregar Foto
                  </button>
                </div>
              </div>

              {/* Sizes Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#3b3830] uppercase tracking-wider block">
                  Tallas Disponibles
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {STANDARD_SIZES.map((size) => {
                    const isSelected = formData.sizes.includes(size);
                    return (
                      <button
                        type="button"
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`min-w-9 h-8 px-2.5 rounded-md text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#1a1a1a] text-white shadow-xs'
                            : 'bg-[#faf9f6] text-[#5e5a4f] border border-[#d8d5ca] hover:border-[#1a1a1a]'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colors selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#3b3830] uppercase tracking-wider block">
                  Colores Disponibles
                </label>
                <div className="flex flex-wrap gap-2 items-center">
                  {formData.colors.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f2efe6] border border-[#dedbd0] text-xs">
                      <span className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: c.hex }} />
                      <span className="text-[#3b3830]">{c.name}</span>
                      <button
                        type="button"
                        onClick={() => removeColorFromForm(idx)}
                        className="text-[#8c887b] hover:text-rose-600 ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-8 h-8 rounded border border-[#d8d5ca] p-0.5 cursor-pointer bg-white"
                  />
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    placeholder="Nombre del color (ej. Crema, Carbón)"
                    className="flex-1 px-3 py-1.5 bg-[#faf9f6] border border-[#d8d5ca] rounded-lg text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={addColorToForm}
                    className="px-3 py-1.5 bg-[#5e5a4f] text-white text-xs rounded-lg hover:bg-[#1a1a1a]"
                  >
                    Añadir Color
                  </button>
                </div>
              </div>

              {/* Description & Materials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3b3830] uppercase tracking-wider block">
                    Descripción de la Prenda
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detalles de corte, silueta y ocasión de uso..."
                    className="w-full px-3 py-2 bg-[#faf9f6] border border-[#d8d5ca] rounded-lg text-xs text-[#1a1a1a] focus:bg-white focus:border-[#1a1a1a] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3b3830] uppercase tracking-wider block">
                    Composición & Materiales
                  </label>
                  <textarea
                    rows={3}
                    value={formData.materials}
                    onChange={(e) => setFormData(prev => ({ ...prev, materials: e.target.value }))}
                    placeholder="Ej. 100% Lino Orgánico de Normandía • Forro en Seda"
                    className="w-full px-3 py-2 bg-[#faf9f6] border border-[#d8d5ca] rounded-lg text-xs text-[#1a1a1a] focus:bg-white focus:border-[#1a1a1a] outline-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ede6]">
                <button
                  type="button"
                  onClick={() => { setActiveTab('prices'); setEditingItem(null); }}
                  className="px-4 py-2 text-xs text-[#615d52] hover:text-[#1a1a1a]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#33312e] text-white px-6 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5 text-[#d2bba0]" />
                  <span>{isSubmitting ? 'Guardando en Firebase...' : editingItem ? 'Actualizar Prenda' : 'Guardar en Firebase'}</span>
                </button>
              </div>

            </form>
          )}

          {/* TAB 3: SETTINGS & DATABASE MANAGEMENT */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              
              {/* Store Branding Form */}
              <div className="bg-white p-6 rounded-xl border border-[#e5e2da] shadow-xs space-y-4">
                <h3 className="font-editorial text-lg font-normal text-[#1a1a1a]">
                  Configuración General de la Boutique
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-[#4a473e] block mb-1">
                      Nombre de la Marca
                    </label>
                    <input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) => onUpdateSettings({ ...settings, storeName: e.target.value })}
                      className="w-full px-3 py-2 bg-[#faf9f6] border border-[#d8d5ca] rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#4a473e] block mb-1">
                      Mensaje de Anuncios Superior
                    </label>
                    <input
                      type="text"
                      value={settings.announcement || ''}
                      onChange={(e) => onUpdateSettings({ ...settings, announcement: e.target.value })}
                      placeholder="Ej. Envío de cortesía en compras superiores a $150"
                      className="w-full px-3 py-2 bg-[#faf9f6] border border-[#d8d5ca] rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#4a473e] block mb-1">
                      WhatsApp para Pedidos & Consultas
                    </label>
                    <input
                      type="text"
                      value={settings.contactWhatsApp || ''}
                      onChange={(e) => onUpdateSettings({ ...settings, contactWhatsApp: e.target.value })}
                      placeholder="+34600000000"
                      className="w-full px-3 py-2 bg-[#faf9f6] border border-[#d8d5ca] rounded-lg text-xs"
                    />
                  </div>

                  <button
                    onClick={async () => {
                      setIsSubmitting(true);
                      try {
                        await saveStoreSettings(settings);
                        showFeedback('Ajustes guardados en Firebase');
                      } catch {
                        showFeedback('Error al guardar ajustes', 'error');
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    className="flex items-center gap-1.5 bg-[#1a1a1a] text-white text-xs px-4 py-2 rounded-lg font-medium hover:bg-[#33312e] mt-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Guardar Configuración en Firestore</span>
                  </button>
                </div>
              </div>

              {/* Database Quick Actions */}
              <div className="bg-white p-6 rounded-xl border border-[#e5e2da] shadow-xs space-y-4">
                <h3 className="font-editorial text-lg font-normal text-[#1a1a1a]">
                  Gestión de Base de Datos Firebase
                </h3>
                <p className="text-xs text-[#736f64] leading-relaxed">
                  Base de datos conectada: <code className="bg-[#f0ede6] px-1.5 py-0.5 rounded text-[11px] text-[#1a1a1a]">robust-epoch-x3kqt</code>. 
                  Todos los cambios realizados en este panel se propagan en milisegundos a todos los visitantes gracias a los WebSockets de Firestore.
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={handleSeedCatalog}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-[#8b5a2b] hover:bg-[#704822] text-white text-xs px-4 py-2.5 rounded-lg font-medium transition-all shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                    <span>Restaurar Catálogo de Muestra (8 Prendas)</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
