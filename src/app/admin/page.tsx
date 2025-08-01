'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RestaurantData } from '@/types';
import { Settings, Menu, LogOut, Zap } from 'lucide-react';
import RestaurantInfoSection from '@/components/Admin/RestaurantInfo';
import CategoryList from '@/components/Admin/CategoryList';
import QuickAddItemModal from '@/components/Admin/QuickAddItemModal';
import DatabaseStatus from '@/components/Admin/DatabaseStatus';

export default function AdminPage() {
  const [data, setData] = useState<RestaurantData | null>(null);
  const [activeTab, setActiveTab] = useState<'restaurant' | 'menu'>('restaurant');
  const [loading, setLoading] = useState(true);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/restaurant');
      if (response.ok) {
        const restaurantData = await response.json();
        setData(restaurantData);
      } else if (response.status === 401) {
        router.push('/admin/login');
      }
    } catch {
      console.error('Veri yüklenemedi');
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout hatası:', error);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, [fetchData]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Veri yüklenemedi</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Restoran ve menü yönetiminizi buradan yapabilirsiniz</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Database Status Icon */}
              <DatabaseStatus iconOnly={true} />
              
              <button
                onClick={() => setShowQuickAddModal(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 text-sm sm:text-base"
                title="Hızlı Ürün Ekle"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Hızlı Ürün Ekle</span>
                <span className="sm:hidden">Hızlı Ekle</span>
              </button>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold transition-colors inline-flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Menüyü Görüntüle</span>
                <span className="sm:hidden">Menü</span>
              </a>
              <button
                onClick={handleLogout}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold transition-colors inline-flex items-center justify-center gap-2 text-sm sm:text-base"
                title="Çıkış Yap"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Çıkış</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('restaurant')}
                className={`flex-1 sm:flex-none py-3 sm:py-4 px-3 sm:px-6 font-medium text-xs sm:text-sm border-b-2 transition-colors ${
                  activeTab === 'restaurant'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline-block mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Restoran Bilgileri</span>
                <span className="sm:hidden">Restoran</span>
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                className={`flex-1 sm:flex-none py-3 sm:py-4 px-3 sm:px-6 font-medium text-xs sm:text-sm border-b-2 transition-colors ${
                  activeTab === 'menu'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline-block mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Menü Yönetimi</span>
                <span className="sm:hidden">Menü</span>
              </button>
            </nav>
          </div>
        </div>



        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'restaurant' && (
            <RestaurantInfoSection 
              restaurantInfo={data.info} 
              onDataChange={fetchData} 
            />
          )}
          
          {activeTab === 'menu' && (
            <CategoryList 
              categories={data.categories} 
              onDataChange={fetchData} 
            />
          )}
        </div>

        {/* Quick Add Item Modal */}
        {showQuickAddModal && data && (
          <QuickAddItemModal
            categories={data.categories}
            onClose={() => setShowQuickAddModal(false)}
            onSave={() => {
              setShowQuickAddModal(false);
              fetchData();
            }}
          />
        )}
      </div>
    </div>
  );
} 