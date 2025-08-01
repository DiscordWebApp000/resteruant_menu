import { RestaurantData } from '@/types';

/**
 * Database boş olduğunda kullanılacak statik fallback verileri
 * Admin veri eklediğinde bu veriler yerine Firestore'dan gelen veriler kullanılır
 */
export const staticRestaurantData: RestaurantData = {
  info: {
    name: "QR Menü Demo Restoran",
    logo: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=200&h=200&fit=crop&crop=center",
    backgroundImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    wifi: {
      name: "Demo_WiFi",
      password: "demo123"
    },
    footer: {
      welcomeText: "Bu demo menüdür. Admin panelinden kendi verilerinizi ekleyebilirsiniz.",
      priceNote: "Fiyatlar demo amaçlıdır",
      copyright: "© 2024 QR Menü Demo • Admin panelinden düzenleyebilirsiniz"
    }
  },
  categories: [
    {
      id: "demo-sicak-icecekler",
      name: "Sıcak İçecekler",
      description: "Demo sıcak içecek kategorisi",
      order: 1,
      items: [
        {
          id: "demo-kahve",
          name: "Kahve",
          description: "Demo kahve ürünü - Admin panelinden düzenleyebilirsiniz",
          price: 25,
          image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop&crop=center",
          available: true,
          preparationTime: "3-5 dk",
          rating: 4.5,
          reviewCount: 50
        },
        {
          id: "demo-cay",
          name: "Çay",
          description: "Demo çay ürünü - Admin panelinden düzenleyebilirsiniz",
          price: 15,
          image: "https://images.unsplash.com/photo-1594631661960-4baa99394ac4?w=400&h=300&fit=crop&crop=center",
          available: true,
          preparationTime: "2-3 dk",
          rating: 4.0,
          reviewCount: 25
        }
      ]
    },
    {
      id: "demo-soguk-icecekler",
      name: "Soğuk İçecekler",
      description: "Demo soğuk içecek kategorisi",
      order: 2,
      items: [
        {
          id: "demo-su",
          name: "Su",
          description: "Demo su ürünü - Admin panelinden düzenleyebilirsiniz",
          price: 5,
          image: "https://images.unsplash.com/photo-1550672652-85cbb7d3b9c0?w=400&h=300&fit=crop&crop=center",
          available: true,
          preparationTime: "Hemen",
          rating: 5.0,
          reviewCount: 10
        },
        {
          id: "demo-meyve-suyu",
          name: "Meyve Suyu",
          description: "Demo meyve suyu ürünü - Admin panelinden düzenleyebilirsiniz",
          price: 20,
          image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop&crop=center",
          available: true,
          preparationTime: "1-2 dk",
          rating: 4.2,
          reviewCount: 15
        }
      ]
    },
    {
      id: "demo-atistirmaliklar",
      name: "Atıştırmalıklar",
      description: "Demo atıştırmalık kategorisi",
      order: 3,
      items: [
        {
          id: "demo-kurabiye",
          name: "Kurabiye",
          description: "Demo kurabiye ürünü - Admin panelinden düzenleyebilirsiniz",
          price: 12,
          image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop&crop=center",
          available: true,
          preparationTime: "Hemen",
          rating: 4.3,
          reviewCount: 20
        }
      ]
    }
  ],
  adminPassword: "admin123"
};

/**
 * Database'in boş olup olmadığını kontrol etmek için kullanılacak
 * minimum kategori sayısı threshold'u
 */
export const MIN_CATEGORIES_THRESHOLD = 1;

/**
 * Static data kullanıldığını belirten flag
 */
export const USING_STATIC_DATA_FLAG = "using-static-data"; 