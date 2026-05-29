import { expect, storeTest as test } from '../playwright/fixtures/authenticated'

const mockProfile = {
  userId: 'user-12345',
  accountId: '9742949',
  email: 'test@example.com',
  restaurantId: 'rest-1',
  omsRestaurantId: 'oms-1',
  hubName: 'Merkez Hub',
  info: {
    externalId: 'ext-1',
    accountId: '9742949',
    channelId: 'channel-1',
    lng: 0,
    brandId: 'brand-1',
    channelRestaurantId: 'channel-rest-1',
    createdAt: Date.now(),
    id: 'info-1',
    lat: 0,
    name: 'Test Restoran',
    state: 'active',
    isAtaExpressActive: false,
    hubId: 'hub-1',
    isCarrierTrackEnable: false,
    authPhone: '5000000000',
    isOrderIntegrationEnabled: false,
    iv: 0,
    workingHours: [],
    isActiveForPackageService: true,
    isOpenForPackageService: true,
    isPartnerEnabled: true,
    updatedAt: Date.now()
  }
}

const mockOrder = {
  orderId: 'ORDER-1001',
  sId: 'S-1001',
  customerName: 'Ahmet Yılmaz',
  customerPhone: '5551234567',
  deliveryAddress: 'Test Mah. Test Sok. No:1',
  customerPosition: [41.01, 29.01] as [number, number],
  isPrepaid: false,
  status: 'created',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  totalAmount: 150.5,
  paymentType: 'cash',
  channel: 'manuel'
}

test.describe('Destek diyaloğu chat token yaşam döngüsü', () => {
  test('sipariş detayındaki destek diyaloğu token alır ve sadece kapanışta invalidate eder', async ({ page }) => {
    await page.addInitScript(() => {
      // AloTech script'i olmadan deterministik test: startWidget stub'ı iframe basar.
      ;(window as any).startWidget = () => {
        const iframe = document.createElement('iframe')
        iframe.id = 'Click2ConnectPackageFrame'
        iframe.src = 'https://example.test/click2connect'
        document.body.appendChild(iframe)
      }
    })

    await page.route('**/auth/profile', async route => {
      if (route.request().method() !== 'GET') {
        await route.fallback()
        return
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProfile)
      })
    })

    await page.route('**/dashboard/order-stats**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          created: 1,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
          total: 1
        })
      })
    })

    await page.route('**/orders/order-list**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          orders: [mockOrder],
          total: 1,
          page: 1,
          limit: 10
        })
      })
    })

    await page.route(`**/orders/order/${mockOrder.orderId}`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOrder)
      })
    })

    let chatTokenRequestCount = 0
    let chatTokenDeleteCount = 0
    let chatTokenRequestBody: any = null

    await page.route('**/chat/token', async route => {
      if (route.request().method() !== 'POST') {
        await route.fallback()
        return
      }

      chatTokenRequestCount += 1
      chatTokenRequestBody = route.request().postDataJSON()

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'chat-token-1',
          expiresIn: 300,
          expiresAt: new Date(Date.now() + 300_000).toISOString()
        })
      })
    })

    await page.route('**/chat/token/*', async route => {
      if (route.request().method() !== 'DELETE') {
        await route.fallback()
        return
      }

      chatTokenDeleteCount += 1
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({})
      })
    })

    await page.goto('/orders')
    await page.waitForLoadState('networkidle')

    await page.locator('table tbody tr').first().click()
    await expect(page.getByText('Sipariş Detayları')).toBeVisible({ timeout: 10000 })

    await page.getByTestId('order-detail-dialog-support-dialog-button').click()

    await expect.poll(() => chatTokenRequestCount).toBe(1)
    expect(chatTokenRequestBody?.orderId).toBe(mockOrder.orderId)
    expect(chatTokenRequestBody?.hubId).toBe(mockProfile.info.hubId)
    expect(chatTokenDeleteCount).toBe(0)

    await expect(page.locator('#Click2ConnectPackageFrame')).toHaveAttribute('src', /click2connect/)

    await page.getByTestId('support-dialog-close-button').click()
    await page.getByTestId('support-dialog-close-confirm').click()
    await expect.poll(() => chatTokenDeleteCount).toBe(1)
  })

  test('topbardaki destek diyaloğu genel token alır ve kapanışta invalidate eder', async ({ page }) => {
    await page.addInitScript(() => {
      ;(window as any).startWidget = () => {
        const iframe = document.createElement('iframe')
        iframe.id = 'Click2ConnectPackageFrame'
        iframe.src = 'https://example.test/click2connect'
        document.body.appendChild(iframe)
      }
    })

    await page.route('**/auth/profile', async route => {
      if (route.request().method() !== 'GET') {
        await route.fallback()
        return
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProfile)
      })
    })

    await page.route('**/dashboard/order-stats**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          created: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
          total: 0
        })
      })
    })

    await page.route('**/dashboard/latest-orders**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ orders: [] })
      })
    })

    let chatTokenRequestCount = 0
    let chatTokenDeleteCount = 0
    let chatTokenRequestBody: any = null

    await page.route('**/chat/token', async route => {
      if (route.request().method() !== 'POST') {
        await route.fallback()
        return
      }

      chatTokenRequestCount += 1
      chatTokenRequestBody = route.request().postDataJSON()

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'chat-token-topbar',
          expiresIn: 300,
          expiresAt: new Date(Date.now() + 300_000).toISOString()
        })
      })
    })

    await page.route('**/chat/token/*', async route => {
      if (route.request().method() !== 'DELETE') {
        await route.fallback()
        return
      }

      chatTokenDeleteCount += 1
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({})
      })
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.getByTitle('Canlı Destek').first().click()

    await expect.poll(() => chatTokenRequestCount).toBe(1)
    expect(chatTokenRequestBody?.hubId).toBe(mockProfile.info.hubId)
    expect(chatTokenRequestBody?.orderId).toBeUndefined()
    expect(chatTokenDeleteCount).toBe(0)

    await expect(page.locator('#Click2ConnectPackageFrame')).toHaveAttribute('src', /click2connect/)

    await page.getByTestId('support-dialog-close-button').click()
    await page.getByTestId('support-dialog-close-confirm').click()
    await expect.poll(() => chatTokenDeleteCount).toBe(1)
  })
})
