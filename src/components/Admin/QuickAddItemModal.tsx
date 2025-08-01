'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MenuCategory } from '@/types';
import { X, Zap, ChevronDown } from 'lucide-react';

interface QuickAddItemModalProps {
  categories: MenuCategory[];
  onClose: () => void;
  onSave: () => void;
}

export default function QuickAddItemModal({ 
  categories, 
  onClose, 
  onSave 
}: QuickAddItemModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    available: true,
    preparationTime: '',
    rating: 0,
    reviewCount: 0
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setShowCategoryDropdown(false);
  };

  const handleSave = async () => {
    if (!selectedCategoryId) {
      setError('Lütfen bir kategori seçin');
      return;
    }

    if (!formData.name || !formData.description || formData.price <= 0) {
      setError('Ürün adı, açıklama ve geçerli bir fiyat gereklidir');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/categories/${selectedCategoryId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Ürün eklenemedi');
      }

      onSave();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Hızlı Ürün Ekle</h3>
                <p className="text-sm text-gray-600">Kategori seçin ve ürün bilgilerini doldurun</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori Seçin
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-left flex items-center justify-between"
                >
                  <span className={selectedCategory ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedCategory ? selectedCategory.name : 'Kategori seçin...'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div>
                          <div className="font-medium text-gray-900">{category.name}</div>
                          <div className="text-sm text-gray-500">{category.description}</div>
                          <div className="text-xs text-gray-400 mt-1">{category.items.length} ürün</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            {selectedCategory && (
              <div className="border-t border-gray-200 pt-6">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-2 text-purple-700">
                    <span className="font-medium">Seçilen kategori:</span>
                    <span className="font-semibold">{selectedCategory.name}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Product Form - Only show if category is selected */}
            {selectedCategory && (
              <>
                {/* Item Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ürün Adı
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Örn: Türk Kahvesi"
                  />
                </div>

                {/* Item Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ürünün detaylı açıklaması"
                    rows={3}
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiyat (₺)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Advanced Options - Collapsible */}
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 py-2 hover:text-purple-600 transition-colors">
                    <span>Gelişmiş Seçenekler (isteğe bağlı)</span>
                  </summary>
                  <div className="mt-4 space-y-4 pl-4 border-l-2 border-purple-100">
                    {/* Image URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resim URL&apos;si
                      </label>
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                      {formData.image && (
                        <div className="mt-3 relative w-full h-32">
                          <Image
                            src={formData.image}
                            alt="Önizleme"
                            fill
                            className="object-cover rounded-lg"
                            onError={() => {
                              // Handle error silently
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Preparation Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hazırlanma Süresi
                      </label>
                      <input
                        type="text"
                        value={formData.preparationTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Örn: 15-20 dk"
                      />
                    </div>

                    {/* Rating */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Puan (1-5)
                        </label>
                        <input
                          type="number"
                          value={formData.rating}
                          onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="0.0"
                          min="0"
                          max="5"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Değerlendirme Sayısı
                        </label>
                        <input
                          type="number"
                          value={formData.reviewCount}
                          onChange={(e) => setFormData(prev => ({ ...prev, reviewCount: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.available}
                          onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                          className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Ürün mevcut (stokta var)
                        </span>
                      </label>
                    </div>
                  </div>
                </details>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isSaving}
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !selectedCategoryId || !formData.name || !formData.description || formData.price <= 0}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Ekleniyor...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Hızlı Ekle
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 