'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RestaurantInfo } from '@/types';
import { Eye, Save, Lock, Shield } from 'lucide-react';

interface RestaurantInfoProps {
  restaurantInfo: RestaurantInfo;
  onDataChange: () => void;
}

export default function RestaurantInfoSection({ 
  restaurantInfo, 
  onDataChange 
}: RestaurantInfoProps) {
  const [formData, setFormData] = useState(restaurantInfo);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Önce mevcut tüm veriyi al
      const currentResponse = await fetch('/api/restaurant');
      if (!currentResponse.ok) {
        alert('Mevcut veriler alınamadı');
        return;
      }
      
      const currentData = await currentResponse.json();
      
      // Sadece info kısmını güncelle, diğer alanları koru
      const updatedData = {
        ...currentData,
        info: formData
      };

      const response = await fetch('/api/restaurant', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        onDataChange();
        alert('Restoran bilgileri güncellendi!');
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        alert('Güncelleme başarısız: ' + (errorData.error || 'Bilinmeyen hata'));
      }
    } catch (error) {
      console.error('Save Error:', error);
      alert('Bir hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(restaurantInfo);

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Yeni şifreler eşleşmiyor');
      return;
    }

    if (passwordForm.newPassword.length < 4) {
      setPasswordError('Yeni şifre en az 4 karakter olmalı');
      return;
    }

    try {
      const response = await fetch('/api/admin/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (response.ok) {
        setPasswordSuccess('Şifre başarıyla değiştirildi!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess('');
        }, 2000);
      } else {
        const error = await response.json();
        setPasswordError(error.error || 'Şifre değiştirilemedi');
      }
    } catch {
      setPasswordError('Bir hata oluştu');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Restoran Bilgileri</h2>
          <p className="text-gray-600 mt-1">Restoran detaylarınızı buradan yönetebilirsiniz</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Şifre Değiştir</span>
              <span className="sm:hidden">Şifre</span>
            </button>
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {previewMode ? 'Düzenleme Modu' : 'Önizleme'}
            </button>
          </div>
          {hasChanges && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          )}
        </div>
      </div>

      {previewMode ? (
        /* Preview Mode */
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4">Önizleme</h3>
          <div className="space-y-4">
            <div className="text-center">
              {formData.logo && (
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <Image
                    src={formData.logo}
                    alt={formData.name}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
              <h1 className="text-3xl font-bold text-gray-900">{formData.name}</h1>
            </div>
            
            {formData.backgroundImage && (
              <div className="mt-6">
                <h4 className="font-medium mb-2">Header Arka Plan:</h4>
                <div className="relative w-full h-48">
                  <Image
                    src={formData.backgroundImage}
                    alt="Header Background"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">WiFi Bilgileri:</h4>
              <p><strong>Ağ Adı:</strong> {formData.wifi?.name}</p>
              <p><strong>Şifre:</strong> {formData.wifi?.password}</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Footer Bilgileri:</h4>
              <p><strong>Hoş Geldin Metni:</strong> {formData.footer?.welcomeText || 'Bu dijital menü QR kod ile erişilmiştir'}</p>
              <p><strong>Fiyat Notu:</strong> {formData.footer?.priceNote || 'Güncel fiyatlar için lütfen personele danışınız'}</p>
              <p><strong>Telif Hakkı:</strong> {formData.footer?.copyright || `© 2024 ${formData.name} • Tüm hakları saklıdır`}</p>
            </div>
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restoran Adı
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>



              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {formData.logo && (
                  <div className="mt-2 relative w-16 h-16">
                    <Image
                      src={formData.logo}
                      alt="Logo önizleme"
                      fill
                      className="object-contain border rounded"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Header Arka Plan Resmi URL
                </label>
                <input
                  type="url"
                  value={formData.backgroundImage || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, backgroundImage: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {formData.backgroundImage && (
                  <div className="mt-2 relative w-full h-32">
                    <Image
                      src={formData.backgroundImage}
                      alt="Background önizleme"
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WiFi Ağ Adı
                </label>
                <input
                  type="text"
                  value={formData.wifi?.name || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    wifi: { ...prev.wifi, name: e.target.value, password: prev.wifi?.password || '' }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WiFi Şifre
                </label>
                <input
                  type="text"
                  value={formData.wifi?.password || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    wifi: { ...prev.wifi, password: e.target.value, name: prev.wifi?.name || '' }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Footer Bilgileri */}
              <div className="border-t border-gray-200 pt-4 mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Footer Bilgileri</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hoş Geldin Metni
                    </label>
                    <input
                      type="text"
                      value={formData.footer?.welcomeText || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        footer: { 
                          ...prev.footer, 
                          welcomeText: e.target.value,
                          priceNote: prev.footer?.priceNote || '',
                          copyright: prev.footer?.copyright || ''
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Bu dijital menü QR kod ile erişilmiştir"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fiyat Notu
                    </label>
                    <input
                      type="text"
                      value={formData.footer?.priceNote || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        footer: { 
                          ...prev.footer, 
                          priceNote: e.target.value,
                          welcomeText: prev.footer?.welcomeText || '',
                          copyright: prev.footer?.copyright || ''
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Güncel fiyatlar için lütfen personele danışınız"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telif Hakkı Metni
                    </label>
                    <input
                      type="text"
                      value={formData.footer?.copyright || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        footer: { 
                          ...prev.footer, 
                          copyright: e.target.value,
                          welcomeText: prev.footer?.welcomeText || '',
                          priceNote: prev.footer?.priceNote || ''
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="© 2024 Restoran Adı • Tüm hakları saklıdır"
                    />
                  </div>
                </div>
              </div>

              {hasChanges && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-800 text-sm">
                    ⚠️ Değişiklikleriniz kaydedilmedi. Kaydetmek için üstteki &quot;Kaydet&quot; butonuna tıklayın.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Admin Şifresi Değiştir</h3>
                  <p className="text-sm text-gray-600">Güvenliğiniz için şifrenizi güncelleyin</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mevcut Şifre
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Mevcut şifrenizi girin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yeni Şifre
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Yeni şifrenizi girin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yeni Şifre (Tekrar)
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Yeni şifrenizi tekrar girin"
                  />
                </div>

                {passwordError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-lg text-sm">
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-lg text-sm">
                    {passwordSuccess}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordError('');
                    setPasswordSuccess('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Şifreyi Değiştir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 