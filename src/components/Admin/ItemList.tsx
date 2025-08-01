'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { MenuCategory, MenuItem } from '@/types';
import { Plus, Edit, Trash2, Menu, Star, Clock } from 'lucide-react';
import ItemModal from '@/components/Admin/ItemModal';

interface ItemListProps {
  category: MenuCategory;
  onDataChange: () => void;
}

export default function ItemList({ category, onDataChange }: ItemListProps) {
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${category.id}/items/${itemId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        onDataChange();
      } else {
        alert('Ürün silinemedi');
      }
    } catch {
      alert('Bir hata oluştu');
    }
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItemId(item.id);
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const openCreateModal = () => {
    setEditingItemId(null);
    setSelectedItem(null);
    setShowItemModal(true);
  };

  const closeModal = () => {
    setShowItemModal(false);
    setSelectedItem(null);
    setEditingItemId(null);
  };

  return (
    <>
      <div className="p-3 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900">Ürünler</h4>
          <button
            onClick={openCreateModal}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 sm:gap-2 flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Ürün Ekle</span>
            <span className="sm:hidden">Ekle</span>
          </button>
        </div>

        {category.items.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <Menu className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm sm:text-base">Bu kategoride henüz ürün bulunmuyor.</p>
            <button
              onClick={openCreateModal}
              className="mt-3 sm:mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              İlk Ürünü Ekle
            </button>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {category.items.map((item) => (
              <div key={item.id} className="flex items-start sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-gray-50">
                {/* Item Image */}
                {item.image && (
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                      onError={() => {
                        // Hide image on error
                      }}
                    />
                  </div>
                )}
                
                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{item.name}</h5>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-1 mt-0.5 sm:mt-1">{item.description}</p>
                      
                      {/* Rating and Preparation Time */}
                      <div className="flex items-center gap-3 mt-1 sm:mt-2">
                        {item.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-gray-600">{item.rating}</span>
                            {item.reviewCount && (
                              <span className="text-xs text-gray-400">({item.reviewCount})</span>
                            )}
                          </div>
                        )}
                        {item.preparationTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-orange-500" />
                            <span className="text-xs text-gray-600">{item.preparationTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 sm:ml-4">
                      <span className="text-base sm:text-lg font-bold text-orange-600">{item.price}₺</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.available ? 'Mevcut' : 'Tükendi'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEditModal(item)}
                    className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors"
                    title="Ürünü Düzenle"
                  >
                    <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="w-7 h-7 sm:w-8 sm:h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors"
                    title="Ürünü Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showItemModal && (
        <ItemModal
          category={category}
          item={selectedItem}
          isEditing={!!editingItemId}
          onClose={closeModal}
          onSave={() => {
            closeModal();
            onDataChange();
          }}
        />
      )}
    </>
  );
} 