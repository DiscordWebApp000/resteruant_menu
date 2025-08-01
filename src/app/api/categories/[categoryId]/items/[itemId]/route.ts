import { NextRequest, NextResponse } from 'next/server';
import { MenuItem } from '@/types';
import { updateItem, deleteItem } from '@/lib/firestore';

// Middleware - Admin session kontrolü
function checkAuth(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin-session');
  return sessionCookie?.value === 'authenticated';
}

// PUT - Ürün güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string; itemId: string }> }
) {
  // Auth kontrolü
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const { categoryId, itemId } = await params;
    const updatedItem: Partial<MenuItem> = await request.json();
    
    // Ürünü güncelle
    await updateItem(categoryId, itemId, updatedItem);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Ürün başarıyla güncellendi' 
    });
  } catch (error) {
    console.error('Ürün güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Ürün güncellenemedi' }, 
      { status: 500 }
    );
  }
}

// DELETE - Ürün sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string; itemId: string }> }
) {
  // Auth kontrolü
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const { categoryId, itemId } = await params;
    
    // Ürünü sil
    await deleteItem(categoryId, itemId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Ürün başarıyla silindi' 
    });
  } catch (error) {
    console.error('Ürün silme hatası:', error);
    return NextResponse.json(
      { error: 'Ürün silinemedi' }, 
      { status: 500 }
    );
  }
} 