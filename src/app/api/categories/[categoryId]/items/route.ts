import { NextRequest, NextResponse } from 'next/server';
import { MenuItem } from '@/types';
import { createItem, getCategories } from '@/lib/firestore';

// Middleware - Admin session kontrolü
function checkAuth(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin-session');
  return sessionCookie?.value === 'authenticated';
}

// GET - Kategorinin ürünlerini al
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  // Auth kontrolü
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const { categoryId } = await params;
    const categories = await getCategories();
    
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) {
      return NextResponse.json(
        { error: 'Kategori bulunamadı' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(category.items);
  } catch (error) {
    console.error('Ürün okuma hatası:', error);
    return NextResponse.json(
      { error: 'Ürünler okunamadı' }, 
      { status: 500 }
    );
  }
}

// POST - Kategoriye yeni ürün ekle
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  // Auth kontrolü
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const { categoryId } = await params;
    const newItem: Omit<MenuItem, 'id'> = await request.json();
    
    // Validation
    if (!newItem.name || !newItem.description || newItem.price === undefined) {
      return NextResponse.json(
        { error: 'Ürün adı, açıklama ve fiyat gereklidir' }, 
        { status: 400 }
      );
    }

    // Kategori var mı kontrol et
    const categories = await getCategories();
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) {
      return NextResponse.json(
        { error: 'Kategori bulunamadı' }, 
        { status: 404 }
      );
    }

    // Ürünü oluştur
    const itemId = await createItem(categoryId, newItem);
    
    const itemWithId: MenuItem = {
      id: itemId,
      ...newItem,
      available: newItem.available !== undefined ? newItem.available : true
    };
    
    return NextResponse.json({ 
      success: true, 
      item: itemWithId,
      message: 'Ürün başarıyla eklendi' 
    });
  } catch (error) {
    console.error('Ürün ekleme hatası:', error);
    return NextResponse.json(
      { error: 'Ürün eklenemedi' }, 
      { status: 500 }
    );
  }
} 