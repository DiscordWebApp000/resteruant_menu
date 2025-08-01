#!/usr/bin/env tsx

/**
 * Test amaçlı database'i temizler
 * Kullanım: npx tsx src/scripts/clear-database.ts
 */

import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

async function clearDatabase() {
  try {
    console.log('🗑️  Database temizleniyor...');
    
    const batch = writeBatch(db);
    
    // Restaurant document'i sil
    const restaurantRef = doc(db, 'restaurants', 'main-restaurant');
    batch.delete(restaurantRef);
    
    // Kategorileri sil
    const categoriesRef = collection(db, 'restaurants', 'main-restaurant', 'categories');
    const categoriesSnapshot = await getDocs(categoriesRef);
    
    let categoryCount = 0;
    let itemCount = 0;
    
    for (const categoryDoc of categoriesSnapshot.docs) {
      categoryCount++;
      
      // Kategorideki ürünleri sil
      const itemsRef = collection(db, 'restaurants', 'main-restaurant', 'categories', categoryDoc.id, 'items');
      const itemsSnapshot = await getDocs(itemsRef);
      
      itemsSnapshot.docs.forEach((itemDoc) => {
        itemCount++;
        batch.delete(itemDoc.ref);
      });
      
      // Kategoriyi sil
      batch.delete(categoryDoc.ref);
    }
    
    await batch.commit();
    
    console.log(`✅ Database temizlendi!`);
    console.log(`📊 Silinen: ${categoryCount} kategori, ${itemCount} ürün`);
    console.log('🎯 Artık statik demo veriler gösterilecek');
    
  } catch (error) {
    console.error('❌ Database temizleme hatası:', error);
    process.exit(1);
  }
}

// Script çalıştırılırsa clearDatabase fonksiyonunu çalıştır
if (require.main === module) {
  clearDatabase();
}

export { clearDatabase }; 