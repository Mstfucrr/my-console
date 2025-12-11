import { expect, test } from '@playwright/test'

// Environment variable'lardan login bilgilerini al
const TEST_ACCOUNT_ID = process.env.TEST_ACCOUNT_ID || ''
const TEST_IDENTIFIER = process.env.TEST_IDENTIFIER || ''
const TEST_PASSWORD = process.env.TEST_PASSWORD || ''
const TEST_ACCESS_TOKEN = process.env.TEST_ACCESS_TOKEN || ''

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
      await page.getByPlaceholder('E-posta veya kullanıcı adı giriniz').fill(TEST_IDENTIFIER)
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

    await page.route('**/location/counties?provinceId=34', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { ilce_id: 1, ilce_adi: 'Kadıköy' },
          { ilce_id: 2, ilce_adi: 'Beşiktaş' },
          { ilce_id: 3, ilce_adi: 'Şişli' }
        ])
      })
    })

    await page.route('**/location/districts?countyId=1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { mahalle_id: 1, mahalle_adi: 'Caferağa Mahallesi' },
          { mahalle_id: 2, mahalle_adi: 'Acıbadem Mahallesi' }
        ])
      })
    })

    await page.route('**/orders/payment-methods', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          paymentMethods: [
            { id: '1', key: 'cash', name: 'Nakit' },
            { id: '2', key: 'card', name: 'Kredi Kartı' },
            { id: '3', key: 'online', name: 'Online Ödeme' }
          ]
        })
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

    // Sayfa başlığının göründüğünü kontrol et
    await expect(page.locator('h3').getByText(/Yeni Sipariş Oluştur/i)).toBeVisible()

    // Müşteri Bilgileri bölümünü doldur
    await page.locator('input[name="firstName"]').fill('Ahmet')
    await page.locator('input[name="lastName"]').fill('Yılmaz')
    await page.locator('input[name="customerPhone"]').fill('5551234567')
    await page.locator('input[name="extensionPhone"]').fill('1234')

    // Sipariş Bilgileri bölümünü doldur
    await page.locator('input[name="preparationTime"]').fill('30')
    await page.locator('input[name="totalAmount"]').fill('150.50')

    // Ödeme tipi seç
    const odemeTipiTrigger = page.locator('button, [role="combobox"]').filter({ hasText: /Ödeme tipi seçiniz/i })
    await odemeTipiTrigger.click()
    await page.getByRole('option', { name: 'Nakit' }).click()

    // Temassız teslimat switch'ini aç
    await page.locator('[id="contactlessDelivery"]').click()

    // Adres Bilgileri bölümünü doldur
    // Şehir seç - CommandTrigger shows placeholder as text content
    const sehirTrigger = page.locator('button, [role="combobox"]').filter({ hasText: /Şehir seçin/i })
    await sehirTrigger.click()
    await page.getByRole('option', { name: 'İstanbul' }).click()

    // İlçe seç (şehir seçildikten sonra yüklenecek)
    const ilceTrigger = page.locator('button, [role="combobox"]').filter({ hasText: /İlçe seçin/i })
    await expect(ilceTrigger).toBeEnabled({ timeout: 5000 })
    await ilceTrigger.click()
    await page.getByRole('option', { name: 'Kadıköy' }).click()

    // Mahalle seç (ilçe seçildikten sonra yüklenecek)
    const mahalleTrigger = page.locator('button, [role="combobox"]').filter({ hasText: /Mahalle seçin/i })
    await expect(mahalleTrigger).toBeEnabled({ timeout: 5000 })
    await mahalleTrigger.click()
    await page.getByRole('option', { name: '19 MAYIS MAHALLESİ' }).click()

    // Diğer adres alanlarını doldur
    await page.locator('input[name="street"]').fill('Atatürk Caddesi')
    await page.locator('input[name="buildingNumber"]').fill('123')
    await page.locator('input[name="floor"]').fill('3')
    await page.locator('input[name="doorNumber"]').fill('12')
    await page.locator('input[name="postalCode"]').fill('34710')

    // Tam adres otomatik doldurulacak, kontrol et
    const fullAddress = await page.locator('textarea[name="fullAddress"]').inputValue()
    expect(fullAddress.length).toBeGreaterThan(10)

    // Adres tarifi ekle
    await page.locator('textarea[name="addressDirection"]').fill('Apartman kapısı mavi renkte')

    // Formu gönder
    await page.getByRole('button', { name: /Siparişi Oluştur/i }).click()

    // Başarı mesajını kontrol et
    await expect(page.locator('.Toastify__toast--success').getByText(/Sipariş başarıyla oluşturuldu/i)).toBeVisible({
      timeout: 10000
    })
  })

  test('Sipariş oluşturma form validasyonları', async ({ page }) => {
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
        body: JSON.stringify({
          paymentMethods: [{ id: '1', key: 'cash', name: 'Nakit' }]
        })
      })
    })

    // Sipariş oluştur sayfasına git
    await page.goto('/orders/create')

    // Formu boş bırakarak göndermeyi dene
    await page.getByRole('button', { name: /Siparişi Oluştur/i }).click()

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

    await page.locator('input[name="customerPhone"]').clear()
    await page.locator('input[name="customerPhone"]').fill('123') // Geçersiz telefon
    await page.getByRole('button', { name: /Siparişi Oluştur/i }).click()

    // Telefon validasyon hatasının göründüğünü kontrol et
    await expect(page.getByText(/Telefon numarası 10 haneli olmalıdır/i)).toBeVisible()

    // Geçersiz hazırlık süresi ile test et
    await page.locator('input[name="customerPhone"]').clear()
    await page.locator('input[name="customerPhone"]').fill('5551234567')
    await page.locator('input[name="preparationTime"]').clear()
    await page.locator('input[name="preparationTime"]').fill('150') // 120'den büyük
    await page.getByRole('button', { name: /Siparişi Oluştur/i }).click()

    // Hazırlık süresi validasyon hatasının göründüğünü kontrol et
    await expect(page.getByText(/Hazırlık süresi en fazla 120 dakika olabilir/i)).toBeVisible()

    // Geçersiz hazırlık süresi (minimum) ile test et
    await page.locator('input[name="preparationTime"]').clear()
    await page.locator('input[name="preparationTime"]').fill('0') // 1'den küçük
    await page.getByRole('button', { name: /Siparişi Oluştur/i }).click()
    await expect(page.getByText(/Hazırlık süresi en az 1 dakika olmalıdır/i)).toBeVisible()

    // Telefon 0 ile başlamamalı test et
    await page.locator('input[name="preparationTime"]').clear()
    await page.locator('input[name="preparationTime"]').fill('30')
    await page.locator('input[name="customerPhone"]').clear()
    await page.locator('input[name="customerPhone"]').fill('0555123456') // 0 ile başlıyor
    await page.getByRole('button', { name: /Siparişi Oluştur/i }).click()
    await expect(page.getByText(/Telefon numarası 0 ile başlamamalıdır/i)).toBeVisible()

    // Toplam tutar validasyonları
    await page.locator('input[name="customerPhone"]').clear()
    await page.locator('input[name="customerPhone"]').fill('5551234567')
    await page.locator('input[name="totalAmount"]').clear()
    await page.locator('input[name="totalAmount"]').fill('0') // Sıfır tutar
    await page.getByRole('button', { name: /Siparişi Oluştur/i }).click()
    await expect(page.getByText(/Toplam tutar sıfırdan büyük olmalıdır/i)).toBeVisible()

    // Adres alanları validasyonları
    await page.locator('input[name="totalAmount"]').clear()
    await page.locator('input[name="totalAmount"]').fill('150.50')

    // Şehir seç
    const sehirTrigger = page.locator('button, [role="combobox"]').filter({ hasText: /Şehir seçin/i })
    await sehirTrigger.click()
    await page.getByRole('option', { name: 'İstanbul' }).click()

    // İlçe seçmeden gönder
    await page.getByRole('button', { name: /Siparişi Oluştur/i }).click()
    await expect(page.getByText(/İlçe zorunludur/i)).toBeVisible()

    // İlçe seç
    await page.route('**/location/counties?provinceId=34', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ ilce_id: 1, ilce_adi: 'Kadıköy' }])
      })
    })
    const ilceTrigger = page.locator('button, [role="combobox"]').filter({ hasText: /İlçe seçin/i })
    await expect(ilceTrigger).toBeEnabled({ timeout: 5000 })
    await ilceTrigger.click()
    await page.getByRole('option', { name: 'Kadıköy' }).click()

    // Mahalle seçmeden gönder
    await page.getByRole('button', { name: /Siparişi Oluştur/i }).click()
    await expect(page.getByText(/Mahalle zorunludur/i)).toBeVisible()

    // Mahalle seç
    await page.route('**/location/districts?countyId=1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ mahalle_id: 1, mahalle_adi: '19 MAYIS MAHALLESİ' }])
      })
    })
    const mahalleTrigger = page.locator('button, [role="combobox"]').filter({ hasText: /Mahalle seçin/i })
    await expect(mahalleTrigger).toBeEnabled({ timeout: 5000 })
    await mahalleTrigger.click()
    await page.getByRole('option', { name: '19 MAYIS MAHALLESİ' }).click()

    // Sokak boş bırakarak gönder
    await page.getByRole('button', { name: /Siparişi Oluştur/i }).click()
    await expect(page.getByText(/Sokak zorunludur/i)).toBeVisible()

    // Sokak doldur, bina no boş bırak
    await page.locator('input[name="street"]').fill('Atatürk Caddesi')
    await page.locator('input[name="buildingNumber"]').clear()
    await page.getByRole('button', { name: /Siparişi Oluştur/i }).click()
    await expect(page.getByText(/Bina numarası zorunludur/i)).toBeVisible()

    // Bina no doldur, daire no boş bırak
    await page.locator('input[name="buildingNumber"]').fill('123')
    await page.locator('input[name="doorNumber"]').clear()
    await page.getByRole('button', { name: /Siparişi Oluştur/i }).click()
    await expect(page.getByText(/Kapı numarası zorunludur/i)).toBeVisible()

    // Daire no doldur, tam adres çok kısa
    await page.locator('input[name="doorNumber"]').fill('12')
    // Tam adres otomatik doldurulacak ama yeterli değilse hata verir
    // Önce formu doldurup sonra tam adresi kontrol et
    const fullAddressField = page.locator('textarea[name="fullAddress"]')
    await fullAddressField.clear()
    await fullAddressField.fill('Kısa') // 10 karakterden az
    await page.getByRole('button', { name: /Siparişi Oluştur/i }).click()
    await expect(page.getByText(/Tam adres en az 10 karakter olmalıdır/i)).toBeVisible()

    // Ödeme tipi seçmeden gönder
    await fullAddressField.clear()
    await fullAddressField.fill('19 MAYIS MAHALLESİ, Atatürk Caddesi No:123 Daire:12, Kadıköy/İstanbul')
    // Ödeme tipini seçme
    await page.getByRole('button', { name: /Siparişi Oluştur/i }).click()
    await expect(page.getByText(/Ödeme tipi seçimi zorunludur/i)).toBeVisible()
  })
})
