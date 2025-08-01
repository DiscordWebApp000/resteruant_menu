import { NextRequest, NextResponse } from 'next/server';
import { MenuCategory } from '@/types';
import { updateCategory, deleteCategory } from '@/lib/firestore';

// Middleware - Admin session kontrolü
function checkAuth(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin-session');
  return sessionCookie?.value === 'authenticated';
}

// PUT - Kategori güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  // Auth kontrolü
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const { categoryId } = await params;
    const updatedCategory: Partial<MenuCategory> = await request.json();
    
    // Kategoriyi güncelle
    await updateCategory(categoryId, updatedCategory);
    
    return NextResponse.json({ 
      success: true,
      message: 'Kategori başarıyla güncellendi' 
    });
  } catch (error) {
    console.error('Kategori güncelleme hatası:', error);
    return NextResponse.json({ error: 'Kategori güncellenemedi' }, { status: 500 });
  }
}

// DELETE - Kategori sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  // Auth kontrolü
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const { categoryId } = await params;
    
    // Kategoriyi sil (items de otomatik silinir)
    await deleteCategory(categoryId);
    
    return NextResponse.json({ 
      success: true,
      message: 'Kategori başarıyla silindi' 
    });
  } catch (error) {
    console.error('Kategori silme hatası:', error);
    return NextResponse.json({ error: 'Kategori silinemedi' }, { status: 500 });
  }
} 