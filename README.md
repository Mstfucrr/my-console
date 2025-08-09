# new-console

Modern ve ölçeklenebilir web uygulaması.

## 🚀 Teknolojiler

- [React](https://react.dev/) - UI kütüphanesi (v18.3.1)
- [Next.js](https://nextjs.org/) - React framework (v14.2.24)
- [TypeScript](https://www.typescriptlang.org/) - Tip güvenliği (v5.8.2)
- [Tailwind CSS](https://tailwindcss.com/) - Stil kütüphanesi (v4.0.12)
- [Shadcn UI](https://ui.shadcn.com/) - UI komponent kütüphanesi
- [TanStack Query](https://tanstack.com/query/latest) - Sunucu state yönetimi (v5.67.2)
- [React Hook Form](https://react-hook-form.com/) - Form yönetimi (v7.54.2)
- [Zod](https://zod.dev/) - Form validasyonu (v3.24.2)
- [Framer Motion](https://www.framer.com/motion/) - Animasyonlar (v12.4.11)
- [ESLint](https://eslint.org/) (v8.57.1) & [Prettier](https://prettier.io/) (v3.5.3) - Kod formatı

## 🛠️ Kurulum

### Ön Gereksinimler

- Node.js (18.x veya üzeri)
- pnpm (Önerilen paket yöneticisi)

1. PNPM Kurulumu (eğer yüklü değilse)

```bash
npm install -g pnpm
```

2. Projeyi klonlayın

```bash
git clone https://gitlab.fiyuu.com.tr/fiyuu_new-console/new-console.git
cd new-console
```

3. Bağımlılıkları yükleyin

```bash
pnpm install
```

4. Ortam değişkenlerini ayarlamak için `.env.local` dosyasını oluşturun ve `.env.example` dosyasnıdan bakarak gerekli kısımları ayarlayın

```bash
cp .env.local
```

5. Geliştirme ortamını dev ortamında başlatın.

```bash
# Development
pnpm dev
```

## 📝 Kullanılabilir Scriptler

```bash
# Geliştirme sunucusunu 3000 portunda başlatır ve hot-reload sağlar
pnpm dev

# Projeyi build eder
pnpm build

# Production build'ini 3000 portunda serve eder
pnpm start

# ESLint ile kod kalitesi ve syntax kontrolü yapar
pnpm lint

# Prettier ile tüm dosyaları belirlenen kurallara göre formatlar
pnpm format
```

## 📁 Proje Yapısı

```
src/
├── app/              # Next.js sayfa ve route yapısı
├── components/       # Genel kullanım komponentleri
├── hooks/           # Custom React hooks
├── lib/             # Utility fonksiyonları
├── modules/         # Feature-based modüller
│   ├── module1/
│   │   ├── components/   # Modül-specific komponentler
│   │   ├── hooks/        # Modül-specific hooks
│   │   └── services/     # Modül-specific API servisleri
├── provider/        # React context providers
├── services/        # API servisleri
├── styles/         # Global stil dosyaları
└── utils/          # Yardımcı fonksiyonlar
```

## 🔍 Geliştirme Kuralları

### Komponent Geliştirme

- Fonksiyonel komponentler ve TypeScript kullanın
- Shadcn UI komponentlerini tercih edin
- Props için interface tanımlamaları yapın
- Erişilebilirlik kurallarına uyun (ARIA attributes, semantic HTML)

### State Yönetimi

- TanStack Query ile API isteklerini yönetin
- React Hook Form ile form state yönetimi yapın
- Zod ile form validasyonları yapın

### Stil ve UI

- Tailwind CSS kullanın
- Responsive tasarım için Tailwind breakpoint'lerini kullanın
- Class birleştirme ve koşullu class içerikleri için `cn` utility'sini kullanın

### **Performans**

- Image optimizasyonu için `CustomImage` komponentini kullanın

### Kod Kalitesi

- ESLint ve Prettier kurallarına uyun
- Unit testler yazın
- Modüler mimariyi koruyun

## 🔄 Dependency Güncelleme

Bağımlılıkları güvenli bir şekilde güncellemek için:

```bash
# Güncellenebilir paketleri kontrol et
pnpm outdated

# Interactive güncelleme
pnpm update -i

# Tüm bağımlılıkları güncelle
pnpm update
```
