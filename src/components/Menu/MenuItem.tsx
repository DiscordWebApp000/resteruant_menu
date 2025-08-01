'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Sparkles, Clock, Heart } from 'lucide-react';
import { MenuItem as MenuItemType } from '@/types';

interface MenuItemProps {
  item: MenuItemType;
  onClick: () => void;
}

export default function MenuItem({ item, onClick }: MenuItemProps) {
  const isAvailable = item.available !== false;
  const [isLiked, setIsLiked] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ürün kartının onClick'ini tetiklemesin
    
    setIsLiked(!isLiked);
    setLikeAnimation(true);
    
    // Floating hearts animasyonu
    if (!isLiked) {
      const newHearts = Array.from({ length: 6 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 60 - 30, // -30 ile +30 arası
        y: Math.random() * 40 - 20  // -20 ile +20 arası
      }));
      setHearts(newHearts);
      
      // Hearts'ları temizle
      setTimeout(() => setHearts([]), 1000);
    }
    
    setTimeout(() => setLikeAnimation(false), 300);
  };
  
  return (
    <div className="group relative">
      {/* Main Card */}
      <button
        onClick={onClick}
        className={`
          w-full text-left relative overflow-hidden
          bg-gradient-to-br from-white/90 via-white/80 to-white/70
          backdrop-blur-xl border border-white/30
          rounded-3xl shadow-2xl shadow-black/10
          transition-all duration-500 ease-out
          ${isAvailable 
            ? 'hover:shadow-3xl hover:shadow-black/20 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer' 
            : 'opacity-60 cursor-not-allowed'
          }
        `}
      >
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Premium Badge */}
        {isAvailable && (
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold rounded-full shadow-lg">
              <Sparkles className="w-3 h-3" />
              <span>Premium</span>
            </div>
          </div>
        )}

        {/* Availability Badge */}
        {!isAvailable && (
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs font-semibold rounded-full shadow-lg">
              <Clock className="w-3 h-3" />
              <span>Tükendi</span>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Image Section */}
          <div className="relative mb-6">
            <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              <Image
                src={item.image || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center`}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                onError={() => {
                  // Handle error silently
                }}
              />
              
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              
              {/* Heart Icon */}
              <div className="absolute top-3 left-3 opacity-80 group-hover:opacity-100 transition-all duration-300">
                <div
                  onClick={handleLike}
                  className={`
                    relative w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full 
                    flex items-center justify-center shadow-lg
                    hover:bg-white hover:scale-110 hover:shadow-xl
                    transition-all duration-200 group/heart cursor-pointer
                    ${likeAnimation ? 'animate-pulse scale-125' : 'scale-100'}
                  `}
                >
                  <Heart 
                    className={`
                      w-4 h-4 transition-all duration-300
                      group-hover/heart:scale-110
                      ${isLiked 
                        ? 'text-red-500 fill-red-500 scale-110' 
                        : 'text-gray-600 group-hover/heart:text-red-400'
                      }
                    `}
                    style={{
                      animation: isLiked && likeAnimation ? 'heartBeat 0.4s ease-in-out' : undefined
                    }}
                  />
                  
                  {/* Floating Hearts */}
                  {hearts.map((heart) => (
                    <div
                      key={heart.id}
                      className="absolute pointer-events-none animate-ping"
                      style={{
                        left: `${heart.x}px`,
                        top: `${heart.y}px`,
                        animation: 'floatUp 1s ease-out forwards'
                      }}
                    >
                      <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Floating Price Tag */}
            <div className="absolute -bottom-3 right-3">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full shadow-xl">
                <span className="font-bold text-lg">₺{item.price}</span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-4">
            {/* Title and Rating */}
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2">
                {item.name}
              </h3>
              
              {/* Rating */}
              {item.rating && (
                <div className="flex items-center gap-1 ml-3">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-700">{item.rating}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {item.description}
            </p>

            {/* Bottom Info */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {item.preparationTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.preparationTime}
                  </span>
                )}
                {item.rating && item.rating >= 4.5 && (
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Popüler
                  </span>
                )}
              </div>
              
              {/* Click Indicator */}
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </button>

      {/* Bottom Shadow */}
      <div className="absolute inset-x-2 -bottom-2 h-6 bg-gradient-to-r from-transparent via-black/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
} 