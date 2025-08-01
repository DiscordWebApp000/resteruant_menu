import { NextRequest, NextResponse } from 'next/server';
import { getAdminPassword, updateAdminPassword, isDatabaseEmpty } from '@/lib/firestore';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    // Database boş mu kontrol et
    const isEmpty = await isDatabaseEmpty();
    
    // Firestore'dan admin şifresini oku
    const adminPassword = await getAdminPassword();
    
    // Şifre kontrolü
    if (password === adminPassword) {
      // Eğer database boşsa ve static data kullanılıyorsa, 
      // bu şifreyi database'e kaydet
      if (isEmpty) {
        try {
          await updateAdminPassword(password);
          console.log('İlk giriş: Admin şifresi database\'e kaydedildi');
        } catch (error) {
          console.warn('Admin şifresi database\'e kaydedilemedi:', error);
        }
      }
      
      // Session cookie'si oluştur
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin-session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 saat
      });
      
      return response;
    } else {
      return NextResponse.json({ error: 'Yanlış şifre' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login hatası:', error);
    return NextResponse.json({ error: 'Server hatası' }, { status: 500 });
  }
} 