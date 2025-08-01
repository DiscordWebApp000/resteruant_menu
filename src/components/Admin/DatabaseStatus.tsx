'use client';

import { useState, useEffect } from 'react';
import { Database, AlertTriangle, CheckCircle } from 'lucide-react';
import { isDatabaseEmpty } from '@/lib/firestore';

interface DatabaseStatusProps {
  iconOnly?: boolean;
}

export default function DatabaseStatus({ iconOnly = false }: DatabaseStatusProps) {
  const [isEmpty, setIsEmpty] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    try {
      setLoading(true);
      const empty = await isDatabaseEmpty();
      setIsEmpty(empty);
    } catch (error) {
      console.error('Database status kontrolü yapılamadı:', error);
      setIsEmpty(true); // Hata durumunda statik veri varsayımı
    } finally {
      setLoading(false);
    }
  };

  // Icon-only version for header
  if (iconOnly) {
    if (!mounted || loading) {
      return (
        <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse" title="Yükleniyor..."></div>
      );
    }

    if (isEmpty) {
      return (
        <div 
          className="relative cursor-pointer"
          onClick={checkDatabaseStatus}
          title="Demo Mod - Statik veriler kullanılıyor"
        >
          <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
        </div>
      );
    }

    return (
      <div 
        className="relative cursor-pointer"
        onClick={checkDatabaseStatus}
        title="Kendi Verileriniz Aktif - Firestore kullanılıyor"
      >
        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-green-600" />
        </div>
      </div>
    );
  }

  // Full version for main content
  // SSR uyumluluğu için component mount olana kadar hiçbir şey render etme
  if (!mounted) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
        <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
        <span className="text-gray-600 text-sm">Yükleniyor...</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-blue-700 text-sm">Database durumu kontrol ediliyor...</span>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-800 text-sm">Demo Mod Aktif</h3>
            <p className="text-amber-700 text-sm mt-1">
              Henüz kendi verilerinizi eklemediniz. Şu anda demo veriler gösteriliyor.
            </p>
            <p className="text-amber-600 text-xs mt-2">
              💡 Kendi verilerinizi eklemek için kategori ve ürün eklemeye başlayın.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <div className="flex-1">
          <h3 className="font-semibold text-green-800 text-sm">Kendi Verileriniz Aktif</h3>
          <p className="text-green-700 text-sm mt-1">
            Firestore databaseinizden veriler kullanılıyor.
          </p>
        </div>
        <button
          onClick={checkDatabaseStatus}
          className="text-green-600 hover:text-green-700 transition-colors"
          title="Durumu yenile"
        >
          <Database className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
} 