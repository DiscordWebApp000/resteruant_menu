'use client';

import { RestaurantInfo } from '@/types';
import Image from 'next/image';
import { Wifi, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface RestaurantHeaderProps {
  info: RestaurantInfo;
}

export default function RestaurantHeader({ info }: RestaurantHeaderProps) {
  const [isWifiOpen, setIsWifiOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="relative h-64 sm:h-80 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${info.backgroundImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'}')`
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-white px-4 py-6">
        <div className="text-center w-full max-w-sm mx-auto">
          {/* Logo */}
          <div className="mb-4 sm:mb-6">
            {info.logo ? (
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
                <Image
                  src={info.logo}
                  alt={`${info.name} Logo`}
                  fill
                  className="rounded-full object-cover border-2 border-white/30 shadow-2xl"
                  onError={() => {
                    // Handle error silently
                  }}
                />
              </div>
            ) : null}
            <div 
              className={`w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-full mx-auto flex items-center justify-center border-2 border-white/30 shadow-2xl ${info.logo ? 'hidden' : ''}`}
            >
              <span className="text-xl sm:text-2xl font-bold text-white">
                {info.name.charAt(0)}
              </span>
            </div>
          </div>
          
          {/* Restaurant Name */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-shadow-lg">
            {info.name}
          </h1>
          <p className="text-sm sm:text-base text-white/90 mb-4 sm:mb-6 font-medium">
            Dijital Menümüze Hoş Geldiniz
          </p>
        </div>
      </div>
      
      {/* Top Right Corner Buttons */}
      <div className="absolute top-4 right-4 z-[100] flex items-center gap-2">
        {/* WiFi Toggle Button */}
        {info.wifi && (
          <button
            onClick={() => setIsWifiOpen(!isWifiOpen)}
            className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300"
          >
            <Wifi className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
      
      {/* WiFi Info Dropdown - Fixed positioning */}
      {info.wifi && isWifiOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-end pt-20 pr-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-transparent"
            onClick={() => setIsWifiOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-72 bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 animate-in slide-in-from-top duration-300">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/20">
            <div className="w-8 h-8 bg-green-500/80 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Wifi className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Ücretsiz WiFi</h3>
              <p className="text-xs text-white/70">Bağlantı bilgileri</p>
            </div>
          </div>
          
          {/* Network Name */}
          <div className="mb-3">
            <label className="text-xs font-medium text-white/70 uppercase tracking-wide">Ağ Adı</label>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                <span className="text-sm font-mono text-white">{info.wifi.name}</span>
              </div>
              <button
                onClick={() => copyToClipboard(info.wifi!.name, 'network')}
                className="w-8 h-8 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors duration-200 border border-white/20"
              >
                {copiedField === 'network' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-white/80" />
                )}
              </button>
            </div>
          </div>
          
          {/* Password */}
          <div className="mb-4">
            <label className="text-xs font-medium text-white/70 uppercase tracking-wide">Şifre</label>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                <span className="text-sm font-mono text-white">{info.wifi.password}</span>
              </div>
              <button
                onClick={() => copyToClipboard(info.wifi!.password, 'password')}
                className="w-8 h-8 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors duration-200 border border-white/20"
              >
                {copiedField === 'password' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-white/80" />
                )}
              </button>
            </div>
          </div>
          
          {/* Tip */}
          <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-3 border border-blue-400/30">
            <p className="text-xs text-blue-200">
              💡 Bağlanmak için ağ adını seçin ve şifreyi girin
            </p>
          </div>
          </div>
        </div>
      )}
    </div>
  );
} 