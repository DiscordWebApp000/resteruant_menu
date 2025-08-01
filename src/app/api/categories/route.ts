import { NextRequest, NextResponse } from 'next/server';
import { MenuCategory } from '@/types';
import { getCategories, createCategory } from '@/lib/firestore';

// Middleware - Admin session kontrolü
function checkAuth(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin-session');
  return sessionCookie?.value === 'authenticated';
}

// GET - Tüm kategorileri al
export async function GET(request: NextRequest) {
  // Auth kontrolü
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Kategori okuma hatası:', error);
    return NextResponse.json(
      { error: 'Kategoriler okunamadı' }, 
      { status: 500 }
    );
  }
}

// POST - Yeni kategori ekle
export async function POST(request: NextRequest) {
  // Auth kontrolü
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const newCategory: Omit<MenuCategory, 'id' | 'items'> = await request.json();
    
    // Validation
    if (!newCategory.name || !newCategory.description) {
      return NextResponse.json(
        { error: 'Kategori adı ve açıklama gereklidir' }, 
        { status: 400 }
      );
    }

    // Mevcut kategorileri al ve sıra numarası oluştur
    const categories = await getCategories();
    const maxOrder = categories.reduce((max: number, cat: MenuCategory) => Math.max(max, cat.order), 0);
    
    const categoryData = {
      ...newCategory,
      order: maxOrder + 1
    };

    // Kategoriyi oluştur
    const categoryId = await createCategory(categoryData);
    
    return NextResponse.json({ 
      success: true, 
      category: { id: categoryId, ...categoryData, items: [] },
      message: 'Kategori başarıyla eklendi' 
    });
  } catch (error) {
    console.error('Kategori ekleme hatası:', error);
    return NextResponse.json(
      { error: 'Kategori eklenemedi' }, 
      { status: 500 }
    );
  }
} 