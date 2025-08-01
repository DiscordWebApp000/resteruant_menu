import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { RestaurantData, RestaurantInfo, MenuCategory, MenuItem } from '@/types';
import { staticRestaurantData, MIN_CATEGORIES_THRESHOLD, USING_STATIC_DATA_FLAG } from '@/data/staticData';

// Restaurant ID - tek bir restoran için sabit ID kullanıyoruz
const RESTAURANT_ID = 'main-restaurant';

// ==================== HELPER FUNCTIONS ====================

/**
 * Database'in boş olup olmadığını kontrol eder
 * Hem kategori sayısını hem de restoran bilgilerinin güncellenmiş olup olmadığını kontrol eder
 */
export async function isDatabaseEmpty(): Promise<boolean> {
  try {
    // Önce restoran dokümantını kontrol et
    const docRef = doc(db, 'restaurants', RESTAURANT_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Eğer USING_STATIC_DATA_FLAG açıkça false yapılmışsa, kullanıcı veri eklemiş demektir
      if (data[USING_STATIC_DATA_FLAG] === false) {
        return false;
      }
      
      // Eğer restoran bilgileri güncellenmiş ise (lastUpdated field varsa), boş değildir
      if (data.lastUpdated) {
        return false;
      }
      
      // Eğer custom restoran bilgileri varsa, boş değildir
      if (data.info && data.info.name && data.info.name !== staticRestaurantData.info.name) {
        return false;
      }
    }
    
    // Son olarak kategori sayısını kontrol et
    const categoriesRef = collection(db, 'restaurants', RESTAURANT_ID, 'categories');
    const querySnapshot = await getDocs(categoriesRef);
    return querySnapshot.size < MIN_CATEGORIES_THRESHOLD;
  } catch (error) {
    console.warn('Database boşluk kontrolü yapılamadı, statik veri kullanılıyor:', error);
    return true; // Hata durumunda statik veri kullan
  }
}

/**
 * Static data kullanıldığında işaretlemek için
 */
export async function markUsingStaticData(): Promise<void> {
  try {
    const docRef = doc(db, 'restaurants', RESTAURANT_ID);
    await setDoc(docRef, {
      [USING_STATIC_DATA_FLAG]: true,
      lastStaticDataUsage: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('Static data flag ayarlanamadı:', error);
  }
}

// ==================== RESTAURANT INFO ====================

export async function getRestaurantInfo(): Promise<RestaurantInfo | null> {
  try {
    const isEmpty = await isDatabaseEmpty();
    
    if (isEmpty) {
      await markUsingStaticData();
      return staticRestaurantData.info;
    }

    const docRef = doc(db, 'restaurants', RESTAURANT_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.info || staticRestaurantData.info;
    }
    return staticRestaurantData.info;
  } catch (error) {
    console.error('Restaurant info getirilemedi, statik veri kullanılıyor:', error);
    return staticRestaurantData.info;
  }
}

export async function updateRestaurantInfo(info: RestaurantInfo): Promise<void> {
  try {
    const docRef = doc(db, 'restaurants', RESTAURANT_ID);
    
    // Use setDoc with merge option to create document if it doesn't exist
    // Also remove the static data flag since we're now using real data
    await setDoc(docRef, {
      info: info,
      [USING_STATIC_DATA_FLAG]: false,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    
    // Cache'yi temizle ki değişiklik hemen görünsün
    clearDataCache();
  } catch (error) {
    console.error('Restaurant info güncellenemedi:', error);
    throw error;
  }
}

// ==================== ADMIN PASSWORD ====================

export async function getAdminPassword(): Promise<string | null> {
  try {
    const isEmpty = await isDatabaseEmpty();
    
    if (isEmpty) {
      return staticRestaurantData.adminPassword;
    }

    const docRef = doc(db, 'restaurants', RESTAURANT_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.adminPassword || staticRestaurantData.adminPassword;
    }
    return staticRestaurantData.adminPassword;
  } catch (error) {
    console.error('Admin password getirilemedi, statik değer kullanılıyor:', error);
    return staticRestaurantData.adminPassword;
  }
}

export async function updateAdminPassword(password: string): Promise<void> {
  try {
    const docRef = doc(db, 'restaurants', RESTAURANT_ID);
    
    // Use setDoc with merge option to create document if it doesn't exist
    await setDoc(docRef, {
      adminPassword: password,
      [USING_STATIC_DATA_FLAG]: false,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Admin password güncellenemedi:', error);
    throw error;
  }
}

// ==================== CATEGORIES ====================

export async function getCategories(): Promise<MenuCategory[]> {
  try {
    const isEmpty = await isDatabaseEmpty();
    
    if (isEmpty) {
      return staticRestaurantData.categories;
    }

    const categoriesRef = collection(db, 'restaurants', RESTAURANT_ID, 'categories');
    const q = query(categoriesRef, orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const categories: MenuCategory[] = [];
    
    for (const categoryDoc of querySnapshot.docs) {
      const categoryData = categoryDoc.data();
      
      // Get items for this category
      const itemsRef = collection(db, 'restaurants', RESTAURANT_ID, 'categories', categoryDoc.id, 'items');
      const itemsSnapshot = await getDocs(itemsRef);
      const items: MenuItem[] = itemsSnapshot.docs.map(itemDoc => ({
        id: itemDoc.id,
        ...itemDoc.data()
      } as MenuItem));
      
      categories.push({
        id: categoryDoc.id,
        ...categoryData,
        items
      } as MenuCategory);
    }
    
    return categories;
  } catch (error) {
    console.error('Kategoriler getirilemedi, statik veriler kullanılıyor:', error);
    return staticRestaurantData.categories;
  }
}

export async function createCategory(categoryData: Omit<MenuCategory, 'id' | 'items'>): Promise<string> {
  try {
    // Generate ID from name
    const categoryId = categoryData.name.toLowerCase()
      .replace(/ş/g, 's')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ç/g, 'c')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/[^a-z0-9]/g, '-');
    
    const categoryRef = doc(db, 'restaurants', RESTAURANT_ID, 'categories', categoryId);
    await setDoc(categoryRef, categoryData);
    
    return categoryId;
  } catch (error) {
    console.error('Kategori oluşturulamadı:', error);
    throw error;
  }
}

export async function updateCategory(categoryId: string, categoryData: Partial<MenuCategory>): Promise<void> {
  try {
    const categoryRef = doc(db, 'restaurants', RESTAURANT_ID, 'categories', categoryId);
    // Remove id and items from update data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, items, ...updateData } = categoryData;
    await updateDoc(categoryRef, updateData);
  } catch (error) {
    console.error('Kategori güncellenemedi:', error);
    throw error;
  }
}

export async function deleteCategory(categoryId: string): Promise<void> {
  try {
    const batch = writeBatch(db);
    
    // Delete all items in the category first
    const itemsRef = collection(db, 'restaurants', RESTAURANT_ID, 'categories', categoryId, 'items');
    const itemsSnapshot = await getDocs(itemsRef);
    
    itemsSnapshot.docs.forEach((itemDoc) => {
      batch.delete(itemDoc.ref);
    });
    
    // Delete the category itself
    const categoryRef = doc(db, 'restaurants', RESTAURANT_ID, 'categories', categoryId);
    batch.delete(categoryRef);
    
    await batch.commit();
  } catch (error) {
    console.error('Kategori silinemedi:', error);
    throw error;
  }
}

// ==================== ITEMS ====================

export async function createItem(categoryId: string, itemData: Omit<MenuItem, 'id'>): Promise<string> {
  try {
    // Generate ID from name
    const itemId = itemData.name.toLowerCase()
      .replace(/ş/g, 's')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ç/g, 'c')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/[^a-z0-9]/g, '-');
    
    const itemRef = doc(db, 'restaurants', RESTAURANT_ID, 'categories', categoryId, 'items', itemId);
    await setDoc(itemRef, itemData);
    
    return itemId;
  } catch (error) {
    console.error('Ürün oluşturulamadı:', error);
    throw error;
  }
}

export async function updateItem(categoryId: string, itemId: string, itemData: Partial<MenuItem>): Promise<void> {
  try {
    const itemRef = doc(db, 'restaurants', RESTAURANT_ID, 'categories', categoryId, 'items', itemId);
    // Remove id from update data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...updateData } = itemData;
    await updateDoc(itemRef, updateData);
  } catch (error) {
    console.error('Ürün güncellenemedi:', error);
    throw error;
  }
}

export async function deleteItem(categoryId: string, itemId: string): Promise<void> {
  try {
    const itemRef = doc(db, 'restaurants', RESTAURANT_ID, 'categories', categoryId, 'items', itemId);
    await deleteDoc(itemRef);
  } catch (error) {
    console.error('Ürün silinemedi:', error);
    throw error;
  }
}

// ==================== FULL DATA ====================

// Cache for consistent results during hydration
let dataCache: { data: RestaurantData | null; timestamp: number } | null = null;
const CACHE_DURATION = 1000; // 1 second cache (shortened for better responsiveness)

// Cache'yi temizlemek için utility fonksiyon
export function clearDataCache(): void {
  dataCache = null;
}

export async function getFullRestaurantData(): Promise<RestaurantData | null> {
  try {
    // Use cache if available and fresh
    if (dataCache && Date.now() - dataCache.timestamp < CACHE_DURATION) {
      return dataCache.data;
    }

    const isEmpty = await isDatabaseEmpty();
    
    let result: RestaurantData | null;
    
    if (isEmpty) {
      result = staticRestaurantData;
    } else {
      const info = await getRestaurantInfo();
      const categories = await getCategories();
      const adminPassword = await getAdminPassword();
      
      if (!info || !adminPassword) {
        result = staticRestaurantData;
      } else {
        result = {
          info,
          categories,
          adminPassword
        };
      }
    }
    
    // Cache the result
    dataCache = {
      data: result,
      timestamp: Date.now()
    };
    
    return result;
  } catch (error) {
    console.error('Tam restoran verisi getirilemedi, statik veri kullanılıyor:', error);
    return staticRestaurantData;
  }
}

// ==================== DATA MIGRATION ====================

export async function migrateFromJSON(data: RestaurantData): Promise<void> {
  try {
    const batch = writeBatch(db);
    
    // Set restaurant info and admin password
    const restaurantRef = doc(db, 'restaurants', RESTAURANT_ID);
    batch.set(restaurantRef, {
      info: data.info,
      adminPassword: data.adminPassword
    });
    
    // Set categories and items
    for (const category of data.categories) {
      const categoryRef = doc(db, 'restaurants', RESTAURANT_ID, 'categories', category.id);
      const { items, ...categoryData } = category;
      batch.set(categoryRef, categoryData);
      
      // Set items for this category
      for (const item of items) {
        const itemRef = doc(db, 'restaurants', RESTAURANT_ID, 'categories', category.id, 'items', item.id);
        batch.set(itemRef, item);
      }
    }
    
    await batch.commit();
    console.log('Veri başarıyla Firestore\'a migrate edildi');
  } catch (error) {
    console.error('Veri migration hatası:', error);
    throw error;
  }
} 