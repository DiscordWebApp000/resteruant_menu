'use client';

import { RestaurantData } from '@/types';
import { useState, useEffect } from 'react';
import RestaurantHeader from './RestaurantHeader';
import CategoryNavigation from './CategoryNavigation';
import MenuCategory from './MenuCategory';

interface MenuProps {
  data: RestaurantData;
}

export default function Menu({ data }: MenuProps) {
  // Kategorileri sıraya göre sırala
  const sortedCategories = [...data.categories].sort((a, b) => a.order - b.order);
  
  // İlk kategoriyi varsayılan olarak seç
  const [activeCategory, setActiveCategory] = useState<string>('');

  // İlk kategoriyi varsayılan olarak ayarla
  useEffect(() => {
    if (sortedCategories.length > 0 && !activeCategory) {
      setActiveCategory(sortedCategories[0].id);
    }
  }, [sortedCategories, activeCategory]);

  // Aktif kategoriyi bul
  const activeCategoryData = sortedCategories.find(cat => cat.id === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restoran Başlığı */}
      <RestaurantHeader info={data.info} />
      
      {/* Kategori Navigasyonu */}
      <CategoryNavigation 
        categories={data.categories} 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      {/* Aktif Kategori İçeriği */}
      <div className="pt-4 sm:pt-8 pb-6 sm:pb-8 min-h-[60vh]">
        {activeCategoryData ? (
          <MenuCategory category={activeCategoryData} />
        ) : (
          <div className="text-center py-12 px-4">
            <p className="text-gray-500">Kategori bulunamadı</p>
          </div>
        )}
      </div>

      {/* Alt Bilgi */}
      <div className="bg-white border-t border-gray-200 px-3 sm:px-4 py-6 sm:py-8 text-center text-sm text-gray-500">
        <div className="max-w-sm sm:max-w-md mx-auto space-y-2 sm:space-y-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mx-auto flex items-center justify-center mb-3 sm:mb-4">
            <span className="text-white font-bold text-lg">
              {data.info.name.charAt(0)}
            </span>
          </div>
          <p className="font-medium text-gray-700 text-sm sm:text-base">
            {data.info.footer?.welcomeText || ''}
          </p>
          <p className="text-xs sm:text-sm">
            {data.info.footer?.priceNote || ''}
          </p>
          <div className="pt-3 sm:pt-4 border-t border-gray-100 mt-4 sm:mt-6">
            <p className="text-xs text-gray-400">
              {data.info.footer?.copyright || ``}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 