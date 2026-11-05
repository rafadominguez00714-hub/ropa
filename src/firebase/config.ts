import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { ClothingItem, CatalogSettings } from '../types/clothing';
import { DEFAULT_CLOTHES } from '../data/defaultCatalog';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Operation types for error handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firebase client is currently offline or connecting:", error.message);
      return false;
    }
    // Any other error (like permission denied on test doc) actually confirms online connectivity to Firestore
    return true;
  }
}
testConnection();

// Authentication Helpers
export async function loginWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

// Clothing Firestore collection helpers
const CLOTHES_PATH = 'clothes';

export function subscribeToClothes(
  callback: (items: ClothingItem[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const collRef = collection(db, CLOTHES_PATH);
  return onSnapshot(
    collRef,
    (snapshot) => {
      const items: ClothingItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          name: data.name || '',
          price: Number(data.price) || 0,
          originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
          category: data.category || 'Varios',
          description: data.description || '',
          materials: data.materials || '',
          images: Array.isArray(data.images) ? data.images : [],
          sizes: Array.isArray(data.sizes) ? data.sizes : [],
          colors: Array.isArray(data.colors) ? data.colors : [],
          stockStatus: data.stockStatus || 'in_stock',
          featured: Boolean(data.featured),
          tag: data.tag || '',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      });
      callback(items);
    },
    (error) => {
      console.error('Error listening to clothes collection:', error);
      onError?.(error);
      handleFirestoreError(error, OperationType.GET, CLOTHES_PATH);
    }
  );
}

// Add a new clothing item
export async function addClothingItem(
  item: Omit<ClothingItem, 'id'>, 
  customId?: string
): Promise<string> {
  const itemId = customId || `cloth_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const docRef = doc(db, CLOTHES_PATH, itemId);
  const now = new Date().toISOString();

  const payload = {
    name: item.name.trim(),
    price: Number(item.price),
    ...(item.originalPrice ? { originalPrice: Number(item.originalPrice) } : {}),
    category: item.category.trim(),
    description: item.description.trim(),
    ...(item.materials ? { materials: item.materials.trim() } : {}),
    images: item.images || [],
    sizes: item.sizes || [],
    colors: item.colors || [],
    stockStatus: item.stockStatus || 'in_stock',
    featured: Boolean(item.featured),
    ...(item.tag ? { tag: item.tag.trim() } : {}),
    createdAt: item.createdAt || now,
    updatedAt: now
  };

  try {
    await setDoc(docRef, payload);
    return itemId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${CLOTHES_PATH}/${itemId}`);
  }
}

// Update existing clothing item or price
export async function updateClothingItem(
  id: string, 
  updates: Partial<ClothingItem>
): Promise<void> {
  const docRef = doc(db, CLOTHES_PATH, id);
  const cleanUpdates: Record<string, any> = {
    updatedAt: new Date().toISOString()
  };

  if (updates.name !== undefined) cleanUpdates.name = updates.name.trim();
  if (updates.price !== undefined) cleanUpdates.price = Number(updates.price);
  if (updates.originalPrice !== undefined) {
    cleanUpdates.originalPrice = updates.originalPrice ? Number(updates.originalPrice) : null;
  }
  if (updates.category !== undefined) cleanUpdates.category = updates.category.trim();
  if (updates.description !== undefined) cleanUpdates.description = updates.description.trim();
  if (updates.materials !== undefined) cleanUpdates.materials = updates.materials.trim();
  if (updates.images !== undefined) cleanUpdates.images = updates.images;
  if (updates.sizes !== undefined) cleanUpdates.sizes = updates.sizes;
  if (updates.colors !== undefined) cleanUpdates.colors = updates.colors;
  if (updates.stockStatus !== undefined) cleanUpdates.stockStatus = updates.stockStatus;
  if (updates.featured !== undefined) cleanUpdates.featured = Boolean(updates.featured);
  if (updates.tag !== undefined) cleanUpdates.tag = updates.tag.trim();

  try {
    await updateDoc(docRef, cleanUpdates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${CLOTHES_PATH}/${id}`);
  }
}

// Delete clothing item
export async function deleteClothingItem(id: string): Promise<void> {
  const docRef = doc(db, CLOTHES_PATH, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${CLOTHES_PATH}/${id}`);
  }
}

// Seed initial default clothes into Firebase
export async function seedInitialCatalog(): Promise<number> {
  let count = 0;
  for (const item of DEFAULT_CLOTHES) {
    const { id, ...data } = item;
    await addClothingItem(data, id);
    count++;
  }
  return count;
}

// Settings collection
const SETTINGS_PATH = 'settings';
const DEFAULT_SETTING_DOC = 'general';

export async function getStoreSettings(): Promise<CatalogSettings | null> {
  try {
    const docSnap = await getDoc(doc(db, SETTINGS_PATH, DEFAULT_SETTING_DOC));
    if (docSnap.exists()) {
      return docSnap.data() as CatalogSettings;
    }
    return null;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
}

export async function saveStoreSettings(settings: CatalogSettings): Promise<void> {
  try {
    await setDoc(doc(db, SETTINGS_PATH, DEFAULT_SETTING_DOC), {
      ...settings,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${SETTINGS_PATH}/${DEFAULT_SETTING_DOC}`);
  }
}
