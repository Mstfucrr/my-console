# Analytics & PostHog (Partner Frontend)

Bu doküman, projede PostHog’un **nasıl kurulduğunu**, **consent (çerez/analitik izni) akışını**, **session recording maskelemesini** ve uygulamanın ürettiği **analytics eventlerini** (custom + otomatik) tek yerde toplar.

## Kurulum / Konfigürasyon

PostHog client tarafında (browser) initialize edilir.

- **Bağımlılık**: `posthog-js`
- **Env değişkenleri**:
  - `NEXT_PUBLIC_POSTHOG_KEY`: varsa PostHog aktif olur
  - `NEXT_PUBLIC_POSTHOG_HOST`: opsiyonel, yoksa `https://eu.i.posthog.com`
- **Nerede init ediliyor**: `src/provider/AnalyticsProvider.tsx`
- **Uygulamaya nerede bağlanıyor**: `src/app/layout.tsx` → `<AnalyticsProvider>{children}</AnalyticsProvider>`

`AnalyticsProvider` içinde öne çıkan ayarlar:

- **SPA pageview**: `capture_pageview: false` ve route değişimlerinde manuel `$pageview` gönderimi, manual capture'ın sebebi SPA/App Router'da route değişimlerinde bazen capture_pageview yakalayamayabiliyor.
- **Page leave**: `capture_pageleave: true`
- **Exceptions**: unhandled error/rejection capture açık
- **Global property**: `app_version` (bkz. `APP_VERSION`) `loaded` callback’inde register edilir
- **Debug**: `NODE_ENV === 'development'` iken açık

## Consent (Analitik Çerez Tercihi) Akışı

Consent akışı **PostHog Feature Flag** ile yönetilir.

- **Flag key**: `show_consent_banner` (bkz. `src/modules/analytics/hooks/usePosthogConsentGate.ts`)
- **Banner component**: `src/modules/analytics/components/AnalyticsConsentBanner.tsx`
- **Storage key**: `analytics_consent` (bkz. `src/modules/analytics/utils/analytics-consent.ts`)

Davranış:

- **Flag `true` (banner göster)**:
  - Storage’da consent `granted` ise `opt_in_capturing()`
  - Storage’da consent `denied` ise `opt_out_capturing()` uygulanır. (Not: `denied` tercihi banner aksiyonu ile storage’a **1 gün expiry** ile kaydedilir; expiry dolunca consent tekrar `null` sayılır ve banner yeniden görünebilir.)
  - Consent `null` ise banner “Kabul et / Reddet” gösterir
- **Flag `false` (banner yok)**:
  - Uygulama otomatik `opt_in_capturing()` yapar

Notlar:

- **Flag yüklenmeden önce**: `useFeatureFlagEnabled()` kısa bir süre `undefined` döndürebilir. Bu aşamada gate effect’i erken döner; PostHog init varsayılan davranışına göre capture açık/kapalı kalır.

Consent storage notları:

- **Değerler**: `'granted' | 'denied' | null`
- **`denied` expiry**: 1 gün sonra otomatik olarak tekrar `null` sayılır (banner yeniden görünebilir)
- **“Tercihleri yönet”** butonu consent’i temizler (`clearAnalyticsConsent`) ve opt-out yapar

## Identify / Logout Reset (User Properties)

Kullanıcı profili yüklendikten sonra PostHog identify yapılır.

- **Nerede**: `src/context/ProfileProvider.tsx`
- **Kimlik**: `posthog.identify(profileData.userId, { ...properties })`
- **Gönderilen user properties**:
  - `email`
  - `accountId`
  - `restaurantId`
  - `omsRestaurantId`
  - `name` (opsiyonel)
  - `channelId` (opsiyonel)

Logout’ta analytics kimliği temizlenir:

- **Nerede**: `src/context/AuthContext.tsx`
- **İşlem**: `posthog.reset()` (sadece `NEXT_PUBLIC_POSTHOG_KEY` varsa)

Ayrıca auth hatalarında (401/403) token temizlenip analytics resetlenir:

- **Nerede**: `src/lib/axios/middleware.ts` (`privateErrorMiddleware`)
- **İşlem**: `removeToken()` + (varsa) `posthog.reset()` + `/login` redirect

## Session Recording Maskeleme

Session recording’de hassas metinleri maskelemek için class bazlı yaklaşım kullanılır.

- **Mask selector**: `.ph-sensitive` (bkz. `src/provider/AnalyticsProvider.tsx`)
- **Mask kuralı**: `maskString(text, { visibleStart: 1, visibleEnd: 1, maskChar: '*' })`

## Event Gönderimi (track wrapper)

Uygulamada custom eventler `track(...)` üzerinden gönderilir:

- **Wrapper**: `src/lib/analytics/index.ts`
  - Browser’da ve PostHog yüklenmişse (`__loaded`) capture eder, aksi halde noop
- **Event registry**: `src/lib/analytics/events.ts` (`ANALYTICS_EVENTS`)
- **Typed payload**: `src/lib/analytics/types.ts` (`AnalyticsEventPayloadMap`)

Örnek kullanım:

```ts
import { track } from '@/lib/analytics'
import { ANALYTICS_EVENTS } from '@/lib/analytics/events'

track(ANALYTICS_EVENTS.ordersFiltersApplied, {
  status: 'Tümü',
  search: { length: 0, type: 'empty' }
})
```

Naming convention:

- **Event isimleri**: `snake_case` (örn. `order_create`)
- **Payload key’leri**: `snake_case` (örn. `total_amount`, `requires_otp`)
- **PII/hassas veri**: event payload’larında mümkün olduğunca göndermeyin; gerekiyorsa UI’da `.ph-sensitive` ile maskeleyin.

## Event Listesi (Custom)

Aşağıdaki liste **`ANALYTICS_EVENTS`** ve ilgili çağrı noktaları esas alınarak günceldir.

### `orders_filters_applied`

- **Nerede**: `src/modules/orders/components/filters/OrderFilters.tsx`
- **Ne zaman**: Sipariş filtreleri “Uygula” ile uygulandığında
- **Payload**:
  - `status`: UI’daki seçimin label değeri (örn. `Tümü`, `Hazırlanıyor` vs.)
  - `search`: `{ length: number; type: 'empty' | 'numeric' | 'text' }` (bkz. `normalizeSearch`)

### `order_create`

- **Nerede**: `src/modules/orders/create/hooks/useCreateOrder.ts`
- **Ne zaman**:
  - `attempt`: submit ile sipariş oluşturma denemesi başladığında
  - `success`: sipariş başarıyla oluşturulduğunda
  - `failed`: backend hata döndüğünde
- **Payload**:
  - **attempt | success**:
    - `status`: `'attempt' | 'success'`
    - `total_amount`: number (kuruş/cents)
    - `city_name?`, `county_name?`, `district_name?`
    - `payment_type_name?`
  - **failed**:
    - `status`: `'failed'`
    - `http_status`: `number | null`
    - `message`: `string | null`

### `purchase_completed`

- **Nerede**: `src/modules/orders/create/hooks/useCreateOrder.ts`
- **Ne zaman**: Sipariş başarıyla oluşturulduğunda (success sonrası ayrıca gönderilir)
- **Payload**:
  - `total_amount`: number (kuruş/cents)
  - `city_name?`, `county_name?`, `district_name?`
  - `payment_type_name?`

### `reconciliation_action`

- **Nerede**: `src/modules/reconciliation/components/reconciliation-details-modal.tsx`
- **Ne zaman**: Mutabakat onay / kontrole gönder aksiyonlarında (attempt/success/failed)
- **Payload**:
  - `action`: `'approve' | 'report'`
  - `status`: `'attempt' | 'success' | 'failed'`
  - `period`: string
  - `record_status`: `ReconciliationStatusType`

### `report_filters_applied`

- **Nerede**: `src/modules/reports/components/reports-filters.tsx`
- **Ne zaman**: Rapor filtreleri “Uygula” ile uygulandığında
- **Payload**:
  - `status`: UI’daki seçimin label değeri
  - `payment_method`: UI’daki seçimin label değeri (yoksa `'all'`)
  - `search`: `{ length: number; type: 'empty' | 'numeric' | 'text' }`
  - `date_range_days?`: seçilen tarih aralığının gün sayısı

### `user_login`

- **Nerede**: `src/modules/auth/context/auth-context.tsx`
- **Ne zaman**:
  - `success`: password veya OTP ile login başarılı olduğunda
  - `failed`: login veya OTP verify adımı başarısız olduğunda
- **Payload**:
  - **success**:
    - `status`: `'success'`
    - `method`: `'password' | 'otp'`
    - `requires_otp`: boolean
  - **failed**:
    - `status`: `'failed'`
    - `stage`: `'login' | 'otp_verify'`
    - `requires_otp`: boolean
    - `http_status`: `number | null`
    - `message?`, `email?`, `accountId?`

### `user_resend_otp`

- **Nerede**: `src/modules/auth/context/auth-context.tsx`
- **Ne zaman**: OTP yeniden gönderim denemelerinde
- **Payload**:
  - **success**: `{ status: 'success' }`
  - **failed**: `{ status: 'failed'; http_status: number | null }`

### `user_logout`

- **Nerede**: `src/context/AuthContext.tsx`
- **Ne zaman**: Kullanıcı logout olduğunda
- **Payload**: yok

### `password_change`

- **Nerede**: `src/modules/auth/views/reset-password.tsx`
- **Ne zaman**: Şifre reset/change akışında
- **Payload**:
  - **success**: `{ status: 'success' }`
  - **failed**: `{ status: 'failed'; http_status: number | null; message: string | null }`

## Otomatik / Altyapı Eventleri

Bu eventler `ANALYTICS_EVENTS` içinde değildir, ancak projede PostHog’a gönderilir.

### `$pageview`

- **Nerede**: `src/provider/AnalyticsProvider.tsx`
- **Ne zaman**: App Router’da route (pathname/search params) değişiminde
- **Payload**:
  - `$current_url`: `window.location.href`
- Not: Kullanıcı opt-out ise (`has_opted_out_capturing`) gönderilmez.

### `api_call` (slow successful calls)

- **Nerede**: `src/lib/axios/middleware.ts`
- **Ne zaman**: Başarılı API çağrıları **yavaşsa** (eşik: `>= 1000ms`)
- **Payload (örnek alanlar)**:
  - `method`, `endpoint` (query’siz path), `duration_ms`, `http_status`
- Not: Uygulamada `track<ApiCallEvent>(ANALYTICS_EVENTS.apiCall, ...)` ile gönderilir.
- `ApiCallEvent` tipi:
  ```ts
  type ApiCallEvent = {
    method?: string
    endpoint?: string
    duration_ms?: number
    http_status?: number
  }
  ```

### API error exception capture

- **Nerede**: `src/lib/axios/middleware.ts`
- **Ne zaman**: Axios error middleware’e düşen hatalarda
- **Nasıl**: `posthog.captureException(error, payload)`
- **Payload (örnek alanlar)**:
  - `scope: 'public' | 'private'`, `endpoint`, `method`, `http_status`, `baseURL`, `code`, `isNetworkError`, `isTimeoutError`, `durationMs`, `pathname`, `errorMessage`, `errorData`

## Yeni Event Eklemek

1. Event adını `src/lib/analytics/events.ts` içine ekleyin (`ANALYTICS_EVENTS`).

2. Payload tipini `src/lib/analytics/types.ts` içine ekleyin ve `AnalyticsEventPayloadMap`’e bağlayın.

3. Event’i tetikleyeceğiniz yerde `track<...>(ANALYTICS_EVENTS.xyz, payload)` ile gönderin.

4. Bu dokümana:

- Event adı
- Nerede tetiklendiği (dosya yolu)
- “Ne zaman” açıklaması
- Payload alanları

ekleyin.
