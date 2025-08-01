// Restaurant ve menü için type tanımları

export interface RestaurantInfo {
  name: string;
  logo?: string;
  backgroundImage?: string;
  wifi?: {
    name: string;
    password: string;
  };
  footer?: {
    welcomeText: string;
    priceNote: string;
    copyright: string;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  available: boolean;
  preparationTime?: string; // örn: "15-20 dk"
  rating?: number; // 1-5 arası
  reviewCount?: number; // kaç kişi değerlendirdi
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
  order: number;
}

export interface RestaurantData {
  info: RestaurantInfo;
  categories: MenuCategory[];
  adminPassword: string;
} 