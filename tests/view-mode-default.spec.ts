import { expect, test } from '@playwright/test'

test.describe('View Mode Default Görünüm', () => {
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
      status: 'created',
      createdAt: new Date().toISOString(),
      totalAmount: 150.5,
      paymentType: 'cash',
      channel: 'console'
    }

    await page.route('**/orders/order-list**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          orders: [mockOrder],
          total: 1
        })
      })
    })

    const ordersResponse = page.waitForResponse(
      response => /\/orders\/order-list(\?|$)/.test(response.url()) && response.status() === 200
    )
    // Siparişler sayfasına git
    await page.goto('/orders')
    await ordersResponse
    await page.waitForLoadState('networkidle')

    // Mobilde card view görünmeli (table görünmemeli)
    // Card view: grid layout ve card component'leri görünür
    const cardView = page.locator('[class*="grid"], [class*="card"]').first()
    await expect(cardView).toBeVisible({ timeout: 5000 })

    // Table view görünmemeli
    const tableView = page.locator('table')
    await expect(tableView).not.toBeVisible()

    // Mock order kartının göründüğünü kontrol et
    await expect(page.locator('[data-testid="order-card"]').first()).toBeVisible()

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
      status: 'created',
      createdAt: new Date().toISOString(),
      totalAmount: 150.5,
      paymentType: 'cash',
      channel: 'console'
    }

    await page.route('**/orders/order-list**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          orders: [mockOrder],
          total: 1
        })
      })
    })

    const ordersResponse = page.waitForResponse(
      response => /\/orders\/order-list(\?|$)/.test(response.url()) && response.status() === 200
    )
    // Siparişler sayfasına git
    await page.goto('/orders')
    await ordersResponse
    await page.waitForLoadState('networkidle')

    // Desktop'ta table view görünmeli
    await expect(page.getByText('Oluşturulma Tarihi')).toBeVisible({ timeout: 5000 })

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
      status: 'created',
      createdAt: new Date().toISOString(),
      totalAmount: 150.5,
      channel: 'console'
    }

    await page.route('**/orders/order-list**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          orders: [mockOrder],
          total: 1
        })
      })
    })

    const ordersResponse = page.waitForResponse(
      response => /\/orders\/order-list(\?|$)/.test(response.url()) && response.status() === 200
    )
    await page.goto('/orders')
    await ordersResponse
    await page.waitForLoadState('networkidle')

    // Mobilde card view görünmeli (mock order görünürlüğü ile doğrula)
    await expect(page.locator('[data-testid="order-card"]').first()).toBeVisible({ timeout: 5000 })

    // Desktop viewport'a geç
    await page.setViewportSize({ width: 1280, height: 720 })

    // Default view mode'unu yeniden hesaplatmak için store'u temizle
    await page.evaluate(() => {
      localStorage.removeItem('view-mode-store')
    })

    // Sayfayı yenile (viewport değişikliği için)
    const ordersReloadResponse = page.waitForResponse(
      response => /\/orders\/order-list(\?|$)/.test(response.url()) && response.status() === 200
    )

    await page.reload()
    await ordersReloadResponse
    await page.waitForLoadState('networkidle')

    // Desktop'ta table view görünmeli
    await expect(page.getByText('Oluşturulma Tarihi')).toBeVisible({ timeout: 5000 })
  })
})
