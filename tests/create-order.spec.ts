import { expect, test } from '@playwright/test'

// Environment variable'lardan login bilgilerini al
const TEST_ACCOUNT_ID = process.env.TEST_ACCOUNT_ID || ''
const TEST_IDENTIFIER = process.env.TEST_IDENTIFIER || ''
const TEST_PASSWORD = process.env.TEST_PASSWORD || ''
const TEST_ACCESS_TOKEN = process.env.TEST_ACCESS_TOKEN || ''

const repeat = (char: string, len: number) => Array.from({ length: len }, () => char).join('')

test.describe('Sipariş Oluşturma', () => {
  test.beforeEach(async ({ page, context }) => {
    // Eğer token varsa direkt localStorage'a set et ve login adımını atla
    if (TEST_ACCESS_TOKEN) {
      await context.addInitScript(token => {
        window.localStorage.setItem(
          'user',
          JSON.stringify({
            accessToken: token,
            refreshToken: token
          })
        )
      }, TEST_ACCESS_TOKEN)

      // Direkt ana sayfaya git (login kontrolü geçilecek)
      await page.goto('/')
      // Sayfanın yüklendiğini bekle
      await page.waitForLoadState('networkidle')
    } else {
      // Token yoksa login akışını kullan
      // Login API endpoint'ini mock'la - requiresOtp: false döndür
      await page.route('**/auth/login', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            accessToken: 'mock-access-token-12345',
            userId: 'user-12345',
            accountId: '9742949',
            requiresOtp: false
          })
        })
      })

      // Login sayfasına git ve giriş yap
      await page.goto('/login')
      await page.getByPlaceholder('Hesap ID giriniz').fill(TEST_ACCOUNT_ID)
      await page.getByPlaceholder('E-posta giriniz').fill(TEST_IDENTIFIER)
      await page.getByPlaceholder('Şifrenizi giriniz').fill(TEST_PASSWORD)
      await page.getByRole('button', { name: /Giriş Yap/i }).click()

      // Ana sayfaya yönlendirildiğini bekle
      await expect(page).toHaveURL('/', { timeout: 10000 })
    }
  })

  test('Yeni sipariş oluşturma akışı', async ({ page }) => {
    // Mock API endpoint'leri
    await page.route('**/location/provinces', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { il_id: 34, il_adi: 'İstanbul' },
          { il_id: 6, il_adi: 'Ankara' },
          { il_id: 35, il_adi: 'İzmir' }
        ])
      })
    })

    await page.route('**/location/query-address**', async route => {
      const url = new URL(route.request().url())
      if (url.searchParams.get('type') === 'county' && url.searchParams.get('provinceId') === '34') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { il_id: 34, il_adi: 'İstanbul', ilce_id: 1, ilce_adi: 'Kadıköy' },
            { il_id: 34, il_adi: 'İstanbul', ilce_id: 2, ilce_adi: 'Beşiktaş' },
            { il_id: 34, il_adi: 'İstanbul', ilce_id: 3, ilce_adi: 'Şişli' }
          ])
        })
        return
      }
      await route.continue()
    })

    await page.route('**/location/query-address**', async route => {
      const url = new URL(route.request().url())
      if (url.searchParams.get('type') === 'district' && url.searchParams.get('countyId') === '1') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { il_id: 34, il_adi: 'İstanbul', mahalle_id: 1, mahalle_adi: 'Caferağa Mahallesi' },
            { il_id: 34, il_adi: 'İstanbul', mahalle_id: 2, mahalle_adi: 'Acıbadem Mahallesi' },
            { il_id: 34, il_adi: 'İstanbul', mahalle_id: 3, mahalle_adi: '19 MAYIS MAHALLESİ' }
          ])
        })
        return
      }
      await route.continue()
    })

    await page.route('**/orders/payment-methods', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', key: 'cash', name: 'Nakit', order: 1 },
          { id: '2', key: 'card', name: 'Kredi Kartı', order: 2 },
          { id: '3', key: 'online', name: 'Online Ödeme', order: 3 }
        ])
      })
    })

    // Sipariş oluşturma endpoint'ini mock'la
    // await page.route('**/orders/create', async route => {
    //   await route.fulfill({
    //     status: 201,
    //     contentType: 'application/json',
    //     body: JSON.stringify({
    //       success: true,
    //       orderId: 'TEST-ORDER-12345',
    //       message: 'Sipariş başarıyla oluşturuldu'
    //     })
    //   })
    // })

    // Sipariş oluştur sayfasına git
    await page.goto('/orders/create')

    // Müşteri Bilgileri bölümünü doldur
    await page.locator('input[name="firstName"]').fill('Ahmet')
    await page.locator('input[name="lastName"]').fill('Yılmaz')
    await page.locator('input[name="customerPhone"]').fill('5551234567')
    await page.locator('input[name="extensionPhone"]').fill('1234')

    // Sipariş Bilgileri bölümünü kontrol et
    // Hazırlık süresi alanının görünmediğini kontrol et
    await expect(page.locator('input[name="preparationTime"], label:has-text("Hazırlık Süresi")')).not.toBeVisible()

    // Ödeme tipi seçimi ilk sırada olmalı (tabIndex 6)
    const odemeTipiTrigger = page.locator('button, [role="combobox"]').filter({ hasText: /Ödeme tipi seçiniz/i })
    await expect(odemeTipiTrigger).toBeVisible()
    await odemeTipiTrigger.click()
    await page.getByRole('option', { name: 'Nakit' }).click()

    // Toplam tutar ikinci sırada olmalı (tabIndex 7)
    const totalAmountInput = page.locator('input[name="totalAmount"]')
    await expect(totalAmountInput).toBeVisible()
    await totalAmountInput.fill('594,80')

    // Temassız teslimat switch'ini aç
    await page.locator('[id="contactlessDelivery"]').click()

    // Adres Bilgileri bölümünü doldur
    // Şehir seç - FormCommandSelectField input field kullanıyor
    const sehirInput = page.locator('input[name="city.id"]')
    await sehirInput.click()
    await sehirInput.fill('İstanbul')
    await page.waitForSelector('[cmdk-item]', { timeout: 5000 })
    await page.locator('[cmdk-item]').filter({ hasText: 'İstanbul' }).click()

    // İlçe seç (şehir seçildikten sonra yüklenecek)
    const ilceInput = page.locator('input[name="county.id"]')
    await expect(ilceInput).toBeEnabled({ timeout: 5000 })
    await ilceInput.click()
    // API response'un gelmesini bekle
    await page.waitForResponse(
      response =>
        response.url().includes('/location/query-address') &&
        response.url().includes('type=county') &&
        response.status() === 200
    )
    await ilceInput.fill('Kadıköy')
    await page.waitForSelector('[cmdk-item]', { timeout: 5000 })
    await page.locator('[cmdk-item]').filter({ hasText: 'KADIKÖY' }).click()

    // Mahalle seç (ilçe seçildikten sonra yüklenecek)
    const mahalleInput = page.locator('input[name="district.id"]')
    await expect(mahalleInput).toBeEnabled({ timeout: 5000 })
    await mahalleInput.click()
    // API response'un gelmesini bekle
    await page.waitForResponse(
      response =>
        response.url().includes('/location/query-address') &&
        response.url().includes('type=district') &&
        response.status() === 200
    )
    await mahalleInput.fill('Caferağa')
    await page.waitForSelector('[cmdk-item]', { timeout: 5000 })
    await page.locator('[cmdk-item]').filter({ hasText: 'CAFERAĞA MAHALLESİ' }).click()

    // Sokak - allowCustomValue=true olduğu için direkt yazılabilir
    const sokakInput = page.locator('input[name="street"]')
    await sokakInput.fill('Atatürk Caddesi')
    await page.locator('input[name="buildingNumber"]').fill('123')
    await page.locator('input[name="floor"]').fill('3')
    await page.locator('input[name="doorNumber"]').fill('12')

    // Adres tarifi ekle
    await page.locator('textarea[name="addressDirection"]').fill('Apartman kapısı mavi renkte')

    // Formu gönder
    await page.getByTestId('create-order-submit-button').click()

    // Başarı mesajını kontrol et
    await expect(page.locator('.Toastify__toast--success').getByText(/Sipariş başarıyla oluşturuldu/i)).toBeVisible({
      timeout: 10000
    })
  })

  test('Sipariş oluşturma form validasyonları', async ({ page }) => {
    // createOrderSchema max limitleri (src/modules/orders/create/constants/index.ts)
    const MAX_FIRST_NAME = 50
    const MAX_LAST_NAME = 50
    const MAX_STREET = 120
    const MAX_BUILDING_NAME = 100
    const MAX_FLOOR = 3
    const MAX_ADDRESS_DIRECTION = 300
    const MAX_TOTAL_AMOUNT_EXCLUSIVE = 1000000 // must be < 1_000_000

    // Mock API endpoint'leri
    await page.route('**/location/provinces', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ il_id: 34, il_adi: 'İstanbul' }])
      })
    })

    await page.route('**/orders/payment-methods', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', key: 'cash', name: 'Nakit' },
          { id: '2', key: 'offline-credit-card', name: 'Kredi Kartı' },
          { id: '3', key: 'online-credit-card', name: 'Kredi Kartı (İnternetten Ödeme)' }
        ])
      })
    })

    // Sipariş oluştur sayfasına git
    await page.goto('/orders/create')

    // Formu boş bırakarak göndermeyi dene
    await page.getByTestId('create-order-submit-button').click()

    // Validasyon hatalarının göründüğünü kontrol et
    // Use exact text match to avoid matching "Soyad en az 2 karakter olmalıdır"
    await expect(page.getByText('Ad en az 2 karakter olmalıdır', { exact: true })).toBeVisible()
    await expect(page.getByText('Soyad en az 2 karakter olmalıdır', { exact: true })).toBeVisible()
    await expect(page.getByText(/Telefon numarası 10 haneli olmalıdır/i)).toBeVisible()
    await expect(page.getByText(/Şehir zorunludur/i)).toBeVisible()

    // Geçersiz telefon numarası ile test et
    // Wait for validation errors to be visible (ensures form is stable), then interact
    await expect(page.getByText('Şehir zorunludur')).toBeVisible()

    // Use specific locator to avoid ambiguity (Ad matches "Tam Adres" and "Adres Tarifi")
    await page.locator('input[name="firstName"]').clear()
    await page.locator('input[name="firstName"]').fill('Ahmet')

    await page.locator('input[name="lastName"]').clear()
    await page.locator('input[name="lastName"]').fill('Yılmaz')

    // Max-length: Ad (50) / Soyad (50)
    await page.locator('input[name="firstName"]').fill(repeat('A', MAX_FIRST_NAME + 1))
    await page.getByTestId('create-order-submit-button').click()
    await expect(page.getByText('Ad en fazla 50 karakter olabilir')).toBeVisible()
    await page.locator('input[name="firstName"]').fill('Ahmet')

    await page.locator('input[name="lastName"]').fill(repeat('B', MAX_LAST_NAME + 1))
    await page.getByTestId('create-order-submit-button').click()
    await expect(page.getByText('Soyad en fazla 50 karakter olabilir')).toBeVisible()
    await page.locator('input[name="lastName"]').fill('Yılmaz')

    await page.locator('input[name="customerPhone"]').clear()
    await page.locator('input[name="customerPhone"]').fill('123') // Geçersiz telefon
    await page.getByTestId('create-order-submit-button').click()

    // Telefon validasyon hatasının göründüğünü kontrol et
    await expect(page.getByText(/Telefon numarası 10 haneli olmalıdır/i)).toBeVisible()

    // Toplam tutar validasyonları
    await page.locator('input[name="customerPhone"]').clear()
    await page.locator('input[name="customerPhone"]').fill('5551234567')
    await page.locator('input[name="totalAmount"]').clear()
    await page.locator('input[name="totalAmount"]').fill('0') // Sıfır tutar
    await page.getByTestId('create-order-submit-button').click()
    await expect(page.getByText(/Toplam tutar sıfırdan büyük olmalıdır/i)).toBeVisible()

    // Max amount: must be < 1.000.000 TL
    await page.locator('input[name="totalAmount"]').clear()
    await page.locator('input[name="totalAmount"]').fill(String(MAX_TOTAL_AMOUNT_EXCLUSIVE))
    await page.getByTestId('create-order-submit-button').click()
    await expect(page.getByText("Toplam tutar 1.000.000 TL'den büyük olamaz")).toBeVisible()

    // Adres alanları validasyonları
    await page.locator('input[name="totalAmount"]').clear()
    await page.locator('input[name="totalAmount"]').fill('2150,50')
    await expect(page.locator('input[name="totalAmount"]')).toHaveValue('2.150,50')

    // Şehir seç
    const sehirInput = page.locator('input[name="city.id"]')
    await sehirInput.click()
    await sehirInput.fill('İstanbul')
    await page.waitForSelector('[cmdk-item]', { timeout: 5000 })
    await page.locator('[cmdk-item]').filter({ hasText: 'İstanbul' }).click()

    // İlçe seçmeden gönder
    await page.getByTestId('create-order-submit-button').click()
    await expect(page.getByText(/İlçe zorunludur/i)).toBeVisible()

    // İlçe seç
    await page.route('**/location/query-address**', async route => {
      const url = new URL(route.request().url())
      if (url.searchParams.get('type') === 'county' && url.searchParams.get('provinceId') === '34') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{ il_id: 34, il_adi: 'İstanbul', ilce_id: 1, ilce_adi: 'KADIKÖY' }])
        })
        return
      }
      await route.continue()
    })
    const ilceInput = page.locator('input[name="county.id"]')
    await expect(ilceInput).toBeEnabled({ timeout: 5000 })
    await ilceInput.click()
    // API response'un gelmesini bekle
    await page.waitForResponse(
      response =>
        response.url().includes('/location/query-address') &&
        response.url().includes('type=county') &&
        response.status() === 200
    )
    await ilceInput.fill('Kadıköy')
    await page.waitForSelector('[cmdk-item]', { timeout: 5000 })
    await page.locator('[cmdk-item]').filter({ hasText: 'KADIKÖY' }).click()

    // Mahalle seçmeden gönder
    await page.getByTestId('create-order-submit-button').click()
    await expect(page.getByText(/Mahalle zorunludur/i)).toBeVisible()

    // Mahalle seç
    await page.route('**/location/query-address**', async route => {
      const url = new URL(route.request().url())
      if (url.searchParams.get('type') === 'district' && url.searchParams.get('countyId') === '1') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{ il_id: 34, il_adi: 'İstanbul', mahalle_id: 1, mahalle_adi: '19 MAYIS MAHALLESİ' }])
        })
        return
      }
      await route.continue()
    })
    const mahalleInput = page.locator('input[name="district.id"]')
    await expect(mahalleInput).toBeEnabled({ timeout: 5000 })
    await mahalleInput.click()
    // API response'un gelmesini bekle
    await page.waitForResponse(
      response =>
        response.url().includes('/location/query-address') &&
        response.url().includes('type=district') &&
        response.status() === 200
    )
    await mahalleInput.fill('19 MAYIS')
    await page.waitForSelector('[cmdk-item]', { timeout: 5000 })
    await page.locator('[cmdk-item]').filter({ hasText: '19 MAYIS MAHALLESİ' }).click() // Sokak boş bırakarak gönder

    // Sokak required (bu noktada street hiç girilmedi)
    await page.getByTestId('create-order-submit-button').click()
    await expect(page.getByText(/Sokak zorunludur/i)).toBeVisible()

    // Max-length: Sokak (120)
    await page.locator('input[name="street"]').fill(repeat('S', MAX_STREET + 1))
    await page.getByTestId('create-order-submit-button').click()
    await expect(page.getByText('Sokak en fazla 120 karakter olabilir')).toBeVisible()
    // Required test için tekrar boşalt
    await page.locator('input[name="street"]').fill('')

    // Max-length: Bina adı (100) - opsiyonel ama girilirse validate edilir
    await page.locator('input[name="buildingName"]').fill(repeat('B', MAX_BUILDING_NAME + 1))
    await page.getByTestId('create-order-submit-button').click()
    await expect(page.getByText('Bina adı en fazla 100 karakter olabilir')).toBeVisible()
    await page.locator('input[name="buildingName"]').clear()

    // Max-length: Kat (3 karakter)
    await page.locator('input[name="floor"]').fill(repeat('1', MAX_FLOOR + 1))
    await page.getByTestId('create-order-submit-button').click()
    await expect(page.getByText('Kat bilgisi en fazla 3 karakter olabilir')).toBeVisible()
    await page.locator('input[name="floor"]').clear()

    // Max-length: Adres tarifi (300) - opsiyonel ama girilirse validate edilir
    await page.locator('textarea[name="addressDirection"]').fill(repeat('T', MAX_ADDRESS_DIRECTION + 1))
    await page.getByTestId('create-order-submit-button').click()
    await expect(page.getByText('Adres tarifi en fazla 300 karakter olabilir')).toBeVisible()
    await page.locator('textarea[name="addressDirection"]').clear()

    // Sokak doldur, bina no boş bırak
    await page.locator('input[name="street"]').fill('Atatürk Caddesi')
    await page.locator('input[name="buildingNumber"]').clear()
    await page.getByTestId('create-order-submit-button').click()
    await expect(page.getByText(/Bina numarası zorunludur/i)).toBeVisible()

    // Bina no doldur, daire no boş bırak
    await page.locator('input[name="buildingNumber"]').fill('123')
    await page.locator('input[name="doorNumber"]').clear()
    await page.getByTestId('create-order-submit-button').click()
    await expect(page.getByText(/Kapı numarası zorunludur/i)).toBeVisible()

    // Daire no doldur, tam adres çok kısa
    await page.locator('input[name="doorNumber"]').fill('12')
    // Ödeme tipini seçme
    await page.getByTestId('create-order-submit-button').click()
    await expect(page.getByText(/Ödeme tipi seçimi zorunludur/i)).toBeVisible()
  })
})
