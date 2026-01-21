import { expect, test } from '@playwright/test'

// Environment variable'lardan login bilgilerini al
const TEST_ACCOUNT_ID = process.env.TEST_ACCOUNT_ID || ''
const TEST_IDENTIFIER = process.env.TEST_IDENTIFIER || ''
const TEST_PASSWORD = process.env.TEST_PASSWORD || ''
const TEST_ACCESS_TOKEN = process.env.TEST_ACCESS_TOKEN || ''

test.describe('View Mode Default Görünüm', () => {
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

      await page.goto('/')
      await page.waitForLoadState('networkidle')
    } else {
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

      await page.goto('/login')
      await page.getByPlaceholder('Hesap ID giriniz').fill(TEST_ACCOUNT_ID)
      await page.getByPlaceholder('E-posta giriniz').fill(TEST_IDENTIFIER)
      await page.getByPlaceholder('Şifrenizi giriniz').fill(TEST_PASSWORD)
      await page.getByRole('button', { name: /Giriş Yap/i }).click()

      await expect(page).toHaveURL('/', { timeout: 10000 })
    }
  })

  test('Mobilde default görünüm kart (card view) olmalıdır', async ({ page, context }) => {
    // Mobil viewport ayarla (iPhone 12 Pro boyutu)
    await page.setViewportSize({ width: 390, height: 844 })

    // LocalStorage'ı temizle (default view mode'u test etmek için)
    await context.addInitScript(() => {
      localStorage.removeItem('view-mode-store')
    })

    // Mock orders list API
    const mockOrder = {
      orderId: 'TEST-ORDER-12345',
      sId: 'S12345',
      customerName: 'Ahmet Yılmaz',
      customerPhone: '5551234567',
      status: 'order-created',
      createdAt: new Date().toISOString(),
      totalAmount: 150.5,
      paymentType: 'cash',
      channel: 'web'
    }

    await page.route('**/orders?**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [mockOrder],
          total: 1
        })
      })
    })

    // Siparişler sayfasına git
    await page.goto('/orders')

    // Sayfanın yüklendiğini bekle
    await page.waitForLoadState('networkidle')

    // Mobilde card view görünmeli (table görünmemeli)
    // Card view: grid layout ve card component'leri görünür
    const cardView = page.locator('[class*="grid"], [class*="card"]').first()
    await expect(cardView).toBeVisible({ timeout: 5000 })

    // Table view görünmemeli
    const tableView = page.locator('table')
    await expect(tableView).not.toBeVisible()

    // Card component'lerinin göründüğünü kontrol et
    // OrderCard component'i Card component'i kullanıyor
    const orderCards = page.locator('[class*="card"][class*="cursor-pointer"]')
    const cardCount = await orderCards.count()
    expect(cardCount).toBeGreaterThan(0)

    // Mobilde card view görünür olduğu için test başarılı
    // LocalStorage kontrolü yapmıyoruz çünkü store'un persist edilmesi component lifecycle'ına bağlı
  })

  test('Browserda (desktop) default görünüm listeleme (table view) olmalıdır', async ({ page, context }) => {
    // Desktop viewport ayarla
    await page.setViewportSize({ width: 1280, height: 720 })

    // LocalStorage'ı temizle (default view mode'u test etmek için)
    await context.addInitScript(() => {
      localStorage.removeItem('view-mode-store')
    })

    // Mock orders list API
    const mockOrder = {
      orderId: 'TEST-ORDER-12345',
      sId: 'S12345',
      customerName: 'Ahmet Yılmaz',
      customerPhone: '5551234567',
      status: 'order-created',
      createdAt: new Date().toISOString(),
      totalAmount: 150.5,
      paymentType: 'cash',
      channel: 'web'
    }

    await page.route('**/orders?**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [mockOrder],
          total: 1
        })
      })
    })

    // Siparişler sayfasına git
    await page.goto('/orders')

    // Sayfanın yüklendiğini bekle
    await page.waitForLoadState('networkidle')

    // Desktop'ta table view görünmeli
    const tableView = page.locator('table')
    await expect(tableView).toBeVisible({ timeout: 5000 })

    // Table header'larının göründüğünü kontrol et
    await expect(page.getByText('Oluşturulma Tarihi')).toBeVisible()
    await expect(page.getByText('Müşteri')).toBeVisible()
    await expect(page.getByText('Durum')).toBeVisible()
    await expect(page.getByText('Kanal')).toBeVisible()
    await expect(page.getByText('Kurye')).toBeVisible()

    // Table body'de satırların göründüğünü kontrol et
    const tableRows = page.locator('table tbody tr')
    const rowCount = await tableRows.count()
    expect(rowCount).toBeGreaterThan(0)

    // Desktop'ta table view görünür olduğu için test başarılı
    // LocalStorage kontrolü yapmıyoruz çünkü store'un persist edilmesi component lifecycle'ına bağlı
  })

  test('Viewport değiştiğinde default view mode güncellenir', async ({ page, context }) => {
    // Önce mobil viewport ile başla
    await page.setViewportSize({ width: 390, height: 844 })

    // LocalStorage'ı temizle
    await context.addInitScript(() => {
      localStorage.removeItem('view-mode-store')
    })

    const mockOrder = {
      orderId: 'TEST-ORDER-12345',
      sId: 'S12345',
      customerName: 'Ahmet Yılmaz',
      status: 'order-created',
      createdAt: new Date().toISOString(),
      totalAmount: 150.5
    }

    await page.route('**/orders?**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [mockOrder],
          total: 1
        })
      })
    })

    await page.goto('/orders')
    await page.waitForLoadState('networkidle')

    // Mobilde card view görünmeli
    const cardView = page.locator('[class*="card"][class*="cursor-pointer"]')
    await expect(cardView.first()).toBeVisible({ timeout: 5000 })

    // Desktop viewport'a geç
    await page.setViewportSize({ width: 1280, height: 720 })

    // Sayfayı yenile (viewport değişikliği için)
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Desktop'ta table view görünmeli
    const tableView = page.locator('table')
    await expect(tableView).toBeVisible({ timeout: 5000 })
  })
})
