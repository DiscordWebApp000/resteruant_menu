import { NextRequest, NextResponse } from 'next/server';
import { getFullRestaurantData, updateRestaurantInfo,  } from '@/lib/firestore';

// Middleware - Admin session kontrolü
function checkAuth(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin-session');
  return sessionCookie?.value === 'authenticated';
}

// GET - Mevcut restaurant verilerini al
export async function GET(request: NextRequest) {
  // URL'den public query parametresini kontrol et
  const url = new URL(request.url);
  const isPublic = url.searchParams.get('public') === 'true';
  
  if (!isPublic && !checkAuth(request)) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const data = await getFullRestaurantData();
    
    if (!data) {
      return NextResponse.json(
        { error: 'Veri bulunamadı' }, 
        { status: 404 }
      );
    }
    
    if (isPublic) {
      // Public erişim için admin şifresini çıkar
      const publicData = { ...data };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { adminPassword, ...rest } = publicData;
      
      // Hydration mismatch'i önlemek için cache headers ekle
      const response = NextResponse.json(rest);
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      return response;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Veri okuma hatası:', error);
    return NextResponse.json(
      { error: 'Veri okunamadı' }, 
      { status: 500 }
    );
  }
}

// PUT - Restaurant verilerini güncelle
export async function PUT(request: NextRequest) {
  // Auth kontrolü
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const { info } = await request.json();
    
    // Veriyi validate et
    if (!info || !info.name) {
      return NextResponse.json(
        { error: 'Geçersiz veri formatı' }, 
        { status: 400 }
      );
    }

    // Firestore'a güncelle
    await updateRestaurantInfo(info);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Veriler başarıyla güncellendi' 
    });
  } catch (error) {
    console.error('Veri yazma hatası:', error);
    return NextResponse.json(
      { error: 'Veri yazılamadı' }, 
      { status: 500 }
    );
  }
} 