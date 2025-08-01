'use client';

import { useState } from 'react';
import { MenuCategory } from '@/types';
import { Edit, Trash2, Plus, Menu, ChevronDown, ChevronRight } from 'lucide-react';
import CategoryModal from './CategoryModal';
import ItemList from './ItemList';

interface CategoryListProps {
  categories: MenuCategory[];
  onDataChange: () => void;
}

export default function CategoryList({ categories, onDataChange }: CategoryListProps) {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    // İlk kategoriyi varsayılan olarak aç
    if (categories.length > 0) {
      return new Set([categories[0].id]);
    }
    return new Set();
  });

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Bu kategoriyi ve tüm ürünlerini silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        onDataChange();
      } else {
        alert('Kategori silinemedi');
      }
    } catch {
      alert('Bir hata oluştu');
    }
  };

  const openEditModal = (category: MenuCategory) => {
    setEditingCategoryId(category.id);
    setSelectedCategory(category);
    setShowCategoryModal(true);
  };

  const openCreateModal = () => {
    setEditingCategoryId(null);
    setSelectedCategory(null);
    setShowCategoryModal(true);
  };

  const closeModal = () => {
    setShowCategoryModal(false);
    setSelectedCategory(null);
    setEditingCategoryId(null);
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  if (categories.length === 0) {
    return (
      <>
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
          <Menu className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz kategori eklenmemiş</h3>
          <p className="text-gray-600 mb-6">Menünüze ilk kategoriyi ekleyerek başlayın.</p>
          <button
            onClick={openCreateModal}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            İlk Kategoriyi Ekle
          </button>
        </div>

        {showCategoryModal && (
          <CategoryModal
            category={selectedCategory}
            isEditing={!!editingCategoryId}
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

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Menü Yönetimi</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Kategoriler ve ürünlerinizi buradan yönetebilirsiniz</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Kategori Ekle</span>
          <span className="sm:hidden">Yeni Kategori</span>
        </button>
      </div>

      {/* Categories List */}
      <div className="grid grid-cols-1 gap-4">
        {categories.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          return (
            <div key={category.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Category Header */}
              <div 
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 sm:p-4 cursor-pointer hover:from-orange-600 hover:to-orange-700 transition-all"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                    <button className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 mt-0.5">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold truncate">{category.name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                        <p className="text-orange-100 text-xs sm:text-sm truncate">{category.description}</p>
                        <span className="text-xs text-orange-200 bg-white/20 px-2 py-1 rounded-full w-fit">
                          {category.items.length} ürün
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => openEditModal(category)}
                      className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                      title="Kategoriyi Düzenle"
                    >
                      <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="w-7 h-7 sm:w-8 sm:h-8 bg-red-500/20 hover:bg-red-500/30 rounded-lg flex items-center justify-center transition-colors"
                      title="Kategoriyi Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Items - Collapsible */}
              {isExpanded && (
                <div className="animate-slideDown">
                  <ItemList category={category} onDataChange={onDataChange} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showCategoryModal && (
        <CategoryModal
          category={selectedCategory}
          isEditing={!!editingCategoryId}
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