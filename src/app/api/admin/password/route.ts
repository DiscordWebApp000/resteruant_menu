import { NextRequest, NextResponse } from 'next/server';
import { getAdminPassword, updateAdminPassword } from '@/lib/firestore';

// Middleware - Admin session kontrolü
function checkAuth(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin-session');
  return sessionCookie?.value === 'authenticated';
}

export async function PUT(request: NextRequest) {
  try {
    // Auth kontrolü
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Mevcut şifre ve yeni şifre gerekli' }, { status: 400 });
    }

    if (newPassword.length < 4) {
      return NextResponse.json({ error: 'Yeni şifre en az 4 karakter olmalı' }, { status: 400 });
    }
    
    // Firebase'den mevcut şifreyi al
    const storedPassword = await getAdminPassword();
    
    // Mevcut şifre kontrolü
    if (currentPassword !== storedPassword) {
      return NextResponse.json({ error: 'Mevcut şifre yanlış' }, { status: 401 });
    }
    
    // Yeni şifreyi Firebase'e kaydet
    await updateAdminPassword(newPassword);
    
    return NextResponse.json({ success: true, message: 'Şifre başarıyla değiştirildi' });
  } catch (error) {
    console.error('Şifre değiştirme hatası:', error);
    return NextResponse.json({ error: 'Server hatası' }, { status: 500 });
  }
} 