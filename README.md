# QR Menü Uygulaması

Bu proje, restoranlara özel dinamik bir QR menü uygulamasıdır. Müşteriler QR kod ile menüye erişebilir, restoran sahipleri ise içerikleri yönetebilir. Uygulama **Next.js** ve **Tailwind CSS** kullanılarak geliştirilmiştir.

---

## 🎯 Proje Amacı

- **Kullanıcı tarafı:** Müşterilerin mobil cihazlarında şık ve kolay erişilebilir bir menü görüntülemesi.
- **Admin paneli:** Restoran sahiplerinin menü içeriklerini (başlık, ürün, fiyat, görsel vs.) düzenleyebileceği basit bir arayüz.

---

## 👥 Kullanıcı Rolleri

### 🧾 Müşteri Arayüzü
- Restoran logosu ve adı
- Wi-Fi bilgisi (şifre vs.)
- Menü başlıkları (örnek: Kahvaltılıklar, İçecekler)
- Her başlık altında:
  - Ürün görseli
  - Ürün ismi
  - Ürün açıklaması
  - Fiyat bilgisi

### 🛠️ Admin Paneli
- Menü düzenleme (başlık, ürün vs.)
- Başlık oluşturma/silme
- Ürün ekleme/düzenleme/silme
- Firma ismi, logo ve Wi-Fi bilgilerini düzenleme
- Tüm içerikler `local JSON dosyasında` saklanacaktır (şimdilik)

---

## 🛠️ Teknolojiler

- **Next.js** (App Router)
- **Tailwind CSS**
- **React Icons / Font Awesome**
- **Yerel JSON veri yönetimi** (ileride veritabanı eklenecek)
- **Responsive tasarım** (mobil odaklı)

---

## 📁 Klasör Yapısı

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── admin/
│   │   └── page.tsx
│   └── globals.css
├── components/
│   ├── Menu/
│   ├── Admin/
│   └── UI/
├── data/
│   └── restaurant.json
└── types/
    └── index.ts
```

---

## 🚀 Kurulum

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

3. **Tarayıcıda açın:**
   http://localhost:3000

---

## 📱 Kullanım

- **Ana sayfa:** Müşteri menü görünümü
- **Admin panel:** http://localhost:3000/admin

---

## 🔧 Özellikler

- [x] Next.js 14 App Router
- [x] Tailwind CSS
- [x] TypeScript
- [x] Responsive tasarım
- [ ] Müşteri menü arayüzü
- [ ] Admin paneli
- [ ] JSON veri yönetimi
- [ ] QR kod üretimi
- [ ] Görsel yükleme sistemi

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
