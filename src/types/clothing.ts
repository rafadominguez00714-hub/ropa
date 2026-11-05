export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface ClothingItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  materials?: string;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  stockStatus: StockStatus;
  featured?: boolean;
  tag?: string; // e.g. "NUEVO", "REBAJADO", "EDICIÓN LIMITADA", "BESTSELLER"
  createdAt?: string;
  updatedAt?: string;
}

export interface CatalogSettings {
  storeName: string;
  currency: string;
  announcement?: string;
  contactWhatsApp?: string;
  updatedAt?: string;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name' | 'newest';
