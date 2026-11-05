import { ClothingItem } from '../types/clothing';

export const DEFAULT_CLOTHES: ClothingItem[] = [
  {
    id: 'cloth_blazer_crema',
    name: 'Blazer Oversize Lana Merino & Seda',
    price: 185000,
    originalPrice: 220000,
    category: 'Abrigos & Chaquetas',
    description: 'Blazer de corte sartorial contemporáneo confeccionado con mezcla premium de lana merino y seda. Presenta hombros estructurados sutiles, solapas pronunciadas y botonadura en cuerno natural.',
    materials: '85% Lana Merino Virgen, 15% Seda Italiana • Forro 100% Cupro',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Crema Arena', hex: '#EAE5D9' },
      { name: 'Negro Profundo', hex: '#1C1C1E' }
    ],
    stockStatus: 'in_stock',
    featured: true,
    tag: 'NUEVO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cloth_trench_classic',
    name: 'Trench Coat Minimalista Algodón Encerado',
    price: 260000,
    category: 'Abrigos & Chaquetas',
    description: 'La silueta atemporal por excelencia reinterpretada sin elementos superfluos. Cinturón desmontable al tono, botonadura oculta y tratamiento hidrófugo ecológico.',
    materials: '100% Algodón Egipcio Gabardina • Resistente al agua',
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Beige Cálido', hex: '#D2BBA0' },
      { name: 'Verde Oliva Pálido', hex: '#7D8471' }
    ],
    stockStatus: 'in_stock',
    featured: true,
    tag: 'BESTSELLER',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cloth_camisa_lino',
    name: 'Camisa Fluida en Lino de Normandía',
    price: 85000,
    originalPrice: 98000,
    category: 'Camisas & Tops',
    description: 'Camisa de caída relajada con cuello desestructurado y costuras francesas reforzadas. El lino europeo cultivado de forma regenerativa adquiere mayor suavidad con cada lavado.',
    materials: '100% Lino Orgánico Francés Certificado',
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=85'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Blanco Roto', hex: '#F7F6F2' },
      { name: 'Lino Crudo', hex: '#D7CDBF' },
      { name: 'Azul Nube', hex: '#A8B7C2' }
    ],
    stockStatus: 'in_stock',
    featured: false,
    tag: 'REBAJAS',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cloth_vestido_seda',
    name: 'Vestido Midi Slip en Seda Morera',
    price: 145000,
    category: 'Vestidos',
    description: 'Vestido al bies con escote sutil y tirantes ajustables ultra finos. Su corte abraza suavemente la figura creando un movimiento etéreo inigualable.',
    materials: '100% Seda Morera Grado 6A (22 Momme)',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Negro Medianoche', hex: '#111111' },
      { name: 'Champaña Suave', hex: '#EED9C4' }
    ],
    stockStatus: 'low_stock',
    featured: true,
    tag: 'EDICIÓN LIMITADA',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cloth_pantalon_sastre',
    name: 'Pantalón Plisado Tiro Alto en Lana Fría',
    price: 115000,
    category: 'Pantalones',
    description: 'Pantalón amplio con pinzas dobles frontales y cintura alta limpia. Acompaña siluetas contemporáneas tanto formales como de diario.',
    materials: '98% Lana Virgen Super 120s, 2% Elastano',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1551854838-212c50b4c184?auto=format&fit=crop&w=1200&q=85'
    ],
    sizes: ['34', '36', '38', '40', '42'],
    colors: [
      { name: 'Gris Grafito', hex: '#404347' },
      { name: 'Gris Perla', hex: '#C2C4C6' }
    ],
    stockStatus: 'in_stock',
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cloth_jersey_cashmere',
    name: 'Suéter Cuello Redondo 100% Cashmere',
    price: 165000,
    originalPrice: 195000,
    category: 'Camisas & Tops',
    description: 'Tejido con galga fina de doble hebra para máxima ligereza y aislamiento térmico. Tacto sublime inalterable con ribetes acanalados minimalistas.',
    materials: '100% Cashmere de Mongolia Sostenible',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=85'
    ],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Avena Natural', hex: '#DFD8CA' },
      { name: 'Marrón Tierra', hex: '#5E4B3C' }
    ],
    stockStatus: 'in_stock',
    featured: true,
    tag: 'REBAJAS',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cloth_bolso_tote',
    name: 'Bolso Tote Estructurado en Piel de Ternera',
    price: 210000,
    category: 'Accesorios & Calzado',
    description: 'Bolso geométrico de proporciones depuradas con interior en ante y bolsillo porta-documentos con cremallera. Asas de hombro reforzadas a mano.',
    materials: '100% Piel Bovina Curtida Vegetal • Hecho en España',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85'
    ],
    sizes: ['Única'],
    colors: [
      { name: 'Caramelo Tostado', hex: '#8B5A2B' },
      { name: 'Negro Mate', hex: '#222222' }
    ],
    stockStatus: 'in_stock',
    featured: false,
    tag: 'EXCLUSIVO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cloth_mocasin_cuero',
    name: 'Mocasines Artesanales Suela Cuero',
    price: 135000,
    category: 'Accesorios & Calzado',
    description: 'Mocasines de línea fina con vira cosida e interior acolchado. Diseño ergonómico sin ornamentos que acentúa la nobleza del cuero encerado.',
    materials: 'Piel Flor Genuina • Suela de Cuero Cosido Goodyear',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1200&q=85'
    ],
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colors: [
      { name: 'Negro Pulido', hex: '#1A1A1A' },
      { name: 'Borgoña Intenso', hex: '#4A1521' }
    ],
    stockStatus: 'low_stock',
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
