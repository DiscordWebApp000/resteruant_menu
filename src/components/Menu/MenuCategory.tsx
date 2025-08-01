'use client';

import { MenuCategory as MenuCategoryType, MenuItem as MenuItemType } from '@/types';
import { ChefHat, Coffee, Utensils, Cookie } from 'lucide-react';
import { useState } from 'react';
import MenuItem from './MenuItem';
import ProductModal from '../UI/ProductModal';

interface MenuCategoryProps {
  category: MenuCategoryType;
}

// Kategori ikonları
const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case 'kahvalti':
      return <Utensils className="w-6 h-6" />;
    case 'sicak-icecekler':
      return <Coffee className="w-6 h-6" />;
    case 'soguk-icecekler':
      return <Coffee className="w-6 h-6" />;
    case 'tatlilar':
      return <Cookie className="w-6 h-6" />;
    default:
      return <ChefHat className="w-6 h-6" />;
  }
};

export default function MenuCategory({ category }: MenuCategoryProps) {
  const [selectedProduct, setSelectedProduct] = useState<MenuItemType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const availableItems = category.items.filter(item => item.available);
  const totalItems = category.items.length;

  const handleProductClick = (product: MenuItemType) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="mb-8 sm:mb-12 animate-in fade-in duration-500">
        {/* Kategori Başlığı */}
        <div className="mb-6 sm:mb-8 px-3 sm:px-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              {getCategoryIcon(category.id)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {category.name}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {availableItems.length} ürün mevcut
                </span>
                {totalItems !== availableItems.length && (
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    {totalItems - availableItems.length} ürün tükendi
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {category.description && (
            <div className="ml-15 pl-3 border-l-2 border-orange-200">
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed italic">
                {category.description}
              </p>
            </div>
          )}
        </div>

        {/* Ürünler Grid */}
        <div className="space-y-4 sm:space-y-6 px-3 sm:px-4">
          {category.items
            .filter(item => item.available || true) // Şimdilik tüm ürünleri göster
            .map((item, index) => (
              <div 
                key={item.id} 
                className="animate-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MenuItem 
                  item={item} 
                  onClick={() => handleProductClick(item)}
                />
              </div>
            ))}
        </div>

        {/* Kategoride hiç ürün yoksa */}
        {category.items.length === 0 && (
          <div className="text-center py-12 sm:py-16 px-3 sm:px-4">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-base sm:text-lg font-medium">Bu kategoride henüz ürün bulunmuyor</p>
            <p className="text-gray-400 text-sm mt-1">Yakında yeni lezzetler eklenecek!</p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          item={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
} 