# Partner

Modern ve ölçeklenebilir web uygulaması.

## 🚀 Teknolojiler

- [React](https://react.dev/) - UI kütüphanesi (v19.2.0)
- [Next.js](https://nextjs.org/) - React framework (v16.0.1)
- [TypeScript](https://www.typescriptlang.org/) - Tip güvenliği (v5.8.2)
- [Tailwind CSS](https://tailwindcss.com/) - Stil kütüphanesi (v4.1.16)
- [Radix UI](https://www.radix-ui.com/) - Headless UI komponentleri (Shadcn UI'nin temelini oluşturur)
- [Shadcn UI](https://ui.shadcn.com/) - UI komponent koleksiyonu
- [TanStack Query](https://tanstack.com/query/latest) - Sunucu state yönetimi (v5.67.2)
- [TanStack Table](https://tanstack.com/table/latest) - Tablo yönetimi (v8.21.3)
- [React Hook Form](https://react-hook-form.com/) - Form yönetimi (v7.54.2)
- [Zod](https://zod.dev/) - Form validasyonu (v3.24.2)
- [Axios](https://axios-http.com/) - HTTP istemcisi (v1.8.2)
- [Framer Motion](https://www.framer.com/motion/) - Animasyonlar (v12.4.11)
- [Zustand](https://zustand-demo.pmnd.rs/) - State yönetimi (v5.0.3)
- [ApexCharts](https://apexcharts.com/) - Grafik kütüphanesi (v5.3.2)
- [Leaflet](https://leafletjs.com/) - Harita kütüphanesi (v1.9.4)
- [React Toastify](https://fkhadra.github.io/react-toastify/) - Toast bildirimleri (v11.0.5)
- [Date-fns](https://date-fns.org/) - Tarih işleme kütüphanesi (v4.1.0)
- [Playwright](https://playwright.dev/) - E2E test framework (v1.56.1)
- [ESLint](https://eslint.org/) (v9.39.1) & [Prettier](https://prettier.io/) (v3.5.3) - Kod formatı

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
cd partner-frontend
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

# Projeyi build eder (SSG - statik dosyalar `out/` klasörüne export edilir)
pnpm build

# ESLint ile kod kalitesi ve syntax kontrolü yapar
pnpm lint

# Prettier ile tüm dosyaları belirlenen kurallara göre formatlar
pnpm format

# Playwright ile E2E testleri çalıştırır
pnpm test

# Playwright testlerini UI modunda çalıştırır
pnpm test:ui

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
tests/               # E2E test dosyaları (Playwright)
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
- E2E testler yazın (Playwright)
- Modüler mimariyi koruyun

## 🧪 Test

Bu proje E2E testler için [Playwright](https://playwright.dev/) kullanmaktadır.

### Test Kurulumu

1. Playwright tarayıcılarını yükleyin (ilk kez çalıştırıyorsanız):

```bash
npx playwright install
```

2. Test ortamı için `.env.test` dosyasını oluşturun ve gerekli environment variable'ları ekleyin:

```bash
touch .env.test
```

`.env.test` dosyasına aşağıdaki değişkenlerden birini ekleyin:

**Seçenek 1: Token ile direkt giriş (Önerilen - Daha hızlı)**

```bash
# Eğer TEST_ACCESS_TOKEN set edilirse, login adımı atlanır ve direkt token kullanılır
TEST_ACCESS_TOKEN=your-access-token-here
```

**Seçenek 2: Login bilgileri ile giriş**

```bash
# TEST_ACCESS_TOKEN yoksa bu bilgiler kullanılır
TEST_ACCOUNT_ID=your-account-id
TEST_IDENTIFIER=your-email-or-username
TEST_PASSWORD=your-password
```

> **Not:** `TEST_ACCESS_TOKEN` varsa login adımı atlanır ve testler daha hızlı çalışır. Token yoksa login akışı kullanılır.

### Test Çalıştırma

```bash
# Tüm testleri çalıştır
pnpm test

# Testleri UI modunda çalıştır (interaktif)
pnpm test:ui

# Belirli bir test dosyasını çalıştır
pnpm test tests/login-and-otp.spec.ts

# Headless modda çalıştır (varsayılan)
pnpm test --headed

# Test sonuçlarını HTML raporunda görüntüle
pnpm test && npx playwright show-report
```

### Test Yapısı

- Test dosyaları `tests/` klasöründe bulunur
- Test dosyaları `.spec.ts` uzantısı ile bitmelidir
- Playwright otomatik olarak geliştirme sunucusunu başlatır (`pnpm dev`)
- Testler `http://localhost:3000` adresinde çalışır

### Test Yazma İpuçları

- API isteklerini mock'lamak için `page.route()` kullanın
- Elementleri bulmak için `getByRole`, `getByPlaceholder`, `getByText` gibi semantik seçicileri tercih edin
- Assertion'lar için `expect()` kullanın
- Testler arasında state temizliği için `beforeEach` ve `afterEach` hook'larını kullanın

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

Farklı bir Node.js versiyonu kullanmak projede sorunlara yol açabilir.

## 📦 Build ve Deployment

Bu proje SSG (Static Site Generation) kullanmaktadır. Build işlemi sonrası statik dosyalar `out/` klasörüne export edilir.

```bash
# Build işlemi
pnpm build

# Build sonrası `out/` klasöründeki statik dosyalar herhangi bir statik web sunucusunda serve edilebilir
```
