# Partner

Modern ve ölçeklenebilir web uygulaması.

## 🚀 Teknolojiler

- [React](https://react.dev/) - UI kütüphanesi (v19.2.0)
- [Next.js](https://nextjs.org/) - React framework (v16.0.1)
- [TypeScript](https://www.typescriptlang.org/) - Tip güvenliği (v5.8.2)
- [Tailwind CSS](https://tailwindcss.com/) - Stil kütüphanesi (v4.1.16)
- [Shadcn UI](https://ui.shadcn.com/) - UI komponent kütüphanesi
- [TanStack Query](https://tanstack.com/query/latest) - Sunucu state yönetimi (v5.67.2)
- [React Hook Form](https://react-hook-form.com/) - Form yönetimi (v7.54.2)
- [Zod](https://zod.dev/) - Form validasyonu (v3.24.2)
- [Framer Motion](https://www.framer.com/motion/) - Animasyonlar (v12.4.11)
- [Zustand](https://zustand-demo.pmnd.rs/) - State yönetimi (v5.0.3)
- [ESLint](https://eslint.org/) (v8.57.1) & [Prettier](https://prettier.io/) (v3.5.3) - Kod formatı

## 🛠️ Kurulum

### Ön Gereksinimler

- Node.js v22.21.1 (NVM kullanarak kurulum önerilir)
- pnpm (Önerilen paket yöneticisi)

1. Node.js Kurulumu (NVM ile)

```bash
# NVM kullanarak doğru Node.js versiyonunu yükleyin ve kullanın
nvm install 22.21.1
nvm use
```

2. PNPM Kurulumu (eğer yüklü değilse)

```bash
npm install -g pnpm
```

3. Projeyi klonlayın

```bash
git clone <repository-url>
cd partner
```

4. Bağımlılıkları yükleyin

```bash
pnpm install
```

5. Ortam değişkenlerini ayarlamak için `.env.local` dosyasını oluşturun ve gerekli ortam değişkenlerini ekleyin

```bash
touch .env.local
```

6. Geliştirme ortamını başlatın

```bash
pnpm dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 📝 Kullanılabilir Scriptler

```bash
# Geliştirme sunucusunu 3000 portunda başlatır ve hot-reload sağlar
pnpm dev

# Projeyi build eder
pnpm build

# Production build'ini serve eder
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
│   ├── (private)/    # Private route'lar (kimlik doğrulama gerektiren)
│   ├── (public)/     # Public route'lar (login, forgot-password vb.)
│   └── api/          # API route'ları
├── components/       # Genel kullanım komponentleri
│   ├── ui/          # Shadcn UI komponentleri
│   └── form/        # Form komponentleri
├── constants/       # Sabitler
├── context/         # React context'leri
├── hooks/           # Custom React hooks
├── lib/             # Utility fonksiyonları
├── modules/         # Feature-based modüller
│   ├── auth/        # Kimlik doğrulama modülü
│   ├── home/        # Ana sayfa modülü
│   ├── menu/        # Menü modülü
│   ├── orders/      # Sipariş modülü
│   ├── reconciliation/  # Mutabakat modülü
│   ├── reports/     # Rapor modülü
│   └── types/       # Tip tanımlamaları
├── provider/        # React context providers
├── store/           # Zustand store'ları
└── styles/          # Global stil dosyaları
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

### Performans

- Image optimizasyonu için Next.js `Image` komponentini kullanın

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

## 📌 Versiyon Yönetimi

Bu proje Node.js v22.21.1 kullanmaktadır. Versiyon yönetimi için:

- **`.nvmrc`**: NVM kullanıcıları için otomatik versiyon seçimi (`nvm use`)
- **`package.json`**: `engines` alanı ile versiyon kontrolü
- **`Dockerfile`**: Docker container'larında kullanılan versiyon

Farklı bir Node.js versiyonu kullanmak projede sorunlara yol açabilir.
