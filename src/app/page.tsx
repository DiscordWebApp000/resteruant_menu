'use client';

import { useState, useEffect } from 'react';
import Menu from '@/components/Menu/Menu';
import { RestaurantData } from '@/types';

export default function Home() {
  const [data, setData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/restaurant?public=true');
        if (response.ok) {
          const restaurantData = await response.json();
          setData(restaurantData);
        } else {
          setError('Veri yüklenemedi');
        }
      } catch (err) {
        setError('Bir hata oluştu');
        console.error('Veri çekme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Menü yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Menü yüklenemedi</p>
          <p className="text-gray-600 mt-2">Lütfen daha sonra tekrar deneyin</p>
        </div>
      </div>
    );
  }

  return <Menu data={data} />;
}
