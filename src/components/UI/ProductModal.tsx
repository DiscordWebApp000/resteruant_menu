'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Heart, Star, Clock, Sparkles, Award } from 'lucide-react';
import { MenuItem } from '@/types';

interface ProductModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ item, isOpen, onClose }: ProductModalProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [ripples, setRipples] = useState<{ id: number }[]>([]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeAnimation(true);
    
    // Floating hearts animasyonu
    if (!isLiked) {
      const newHearts = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100 - 50, // -50 ile +50 arası
        y: Math.random() * 60 - 30   // -30 ile +30 arası
      }));
      setHearts(newHearts);
      
      // Ripple effect
      const newRipple = { id: Date.now() };
      setRipples([newRipple]);
      
      // Temizle
      setTimeout(() => setHearts([]), 1200);
      setTimeout(() => setRipples([]), 600);
    }
    
    setTimeout(() => setLikeAnimation(false), 400);
  };
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isAvailable = item.available !== false;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 mb-4 sm:mb-0 bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slideUp max-h-[90vh] overflow-hidden">
        {/* Hero Image Section */}
        <div className="relative h-64 sm:h-80 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          <Image
            src={item.image || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&crop=center`}
            alt={item.name}
            fill
            className="object-cover"
            onError={() => {
              // Handle error silently
            }}
          />
          
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
          
          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            {/* Heart Button */}
            <button 
              onClick={handleLike}
              className={`
                relative w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full 
                flex items-center justify-center shadow-lg 
                hover:bg-white hover:scale-110 hover:shadow-xl
                transition-all duration-300 overflow-hidden group/heart
                ${likeAnimation ? 'scale-125 bg-red-50' : 'scale-100'}
              `}
            >
              <Heart 
                className={`
                  w-5 h-5 transition-all duration-300 z-10
                  group-hover/heart:scale-110
                  ${isLiked 
                    ? 'text-red-500 fill-red-500 scale-110 drop-shadow-lg' 
                    : 'text-gray-600 group-hover/heart:text-red-400'
                  }
                  ${likeAnimation ? 'animate-pulse' : ''}
                `} 
                style={{
                  animation: isLiked && likeAnimation ? 'heartBeat 0.4s ease-in-out' : undefined
                }}
              />
              
              {/* Ripple Effects */}
              {ripples.map((ripple) => (
                <div
                  key={ripple.id}
                  className="absolute inset-0 bg-red-400/30 rounded-full animate-ping"
                  style={{ animationDuration: '0.6s' }}
                />
              ))}
              
              {/* Floating Hearts */}
              {hearts.map((heart) => (
                <div
                  key={heart.id}
                  className="absolute pointer-events-none z-20"
                  style={{
                    left: `calc(50% + ${heart.x}px)`,
                    top: `calc(50% + ${heart.y}px)`,
                    animation: 'floatUpModal 1.2s ease-out forwards'
                  }}
                >
                  <Heart className="w-4 h-4 text-red-500 fill-red-500 drop-shadow-sm" />
                </div>
              ))}
            </button>
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          
          {/* Status Badge */}
          <div className="absolute bottom-4 left-4">
            {isAvailable ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-lg">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">Mevcut</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-lg">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-semibold">Tükendi</span>
              </div>
            )}
          </div>
          
          {/* Rating Badge */}
          {item.rating && (
            <div className="absolute bottom-4 right-4">
              <div className="flex items-center gap-1 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-gray-800">{item.rating}</span>
                {item.reviewCount && (
                  <span className="text-xs text-gray-500">({item.reviewCount})</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 max-h-[calc(90vh-16rem)] sm:max-h-[calc(90vh-20rem)] overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-2xl font-bold text-gray-900 leading-tight pr-4">
                {item.name}
              </h2>
              <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-lg">
                <Award className="w-4 h-4" />
                <span className="text-sm font-semibold">Premium</span>
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {item.preparationTime && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-700">{item.preparationTime}</span>
              </div>
            )}
            {item.rating && item.rating >= 4.5 && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-700">Popüler</span>
              </div>
            )}
          </div>

          {/* Price Section */}
          {isAvailable && (
            <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
              <div className="text-lg text-orange-600 font-medium mb-2">Fiyat</div>
              <div className="text-3xl font-bold text-orange-700 mb-3">₺{item.price}</div>
              <p className="text-sm text-orange-600">
                Sipariş vermek için garsonunuza söyleyiniz
              </p>
            </div>
          )}

          {/* Unavailable Message */}
          {!isAvailable && (
            <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Şu Anda Mevcut Değil</h3>
              <p className="text-gray-600">Bu ürün geçici olarak tükendi. Lütfen daha sonra tekrar deneyin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 