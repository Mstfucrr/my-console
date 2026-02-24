import { expect, Page, test, type BrowserContext, type Route } from '@playwright/test'

const TEST_ACCESS_TOKEN = process.env.TEST_ACCESS_TOKEN || 'mock-access-token-12345'

const mockProfile = {
  userId: 'user-12345',
  accountId: '9742949',
  email: 'test@example.com',
  restaurantId: 'rest-1',
  omsRestaurantId: 'oms-1',
  tab_fr: false,
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

type SortRequest = {
  sortBy: string | null
  sortDirection: string | null
  url: string
}

function getSortParamsFromUrl(url: string): SortRequest {
  const u = new URL(url)
  return {
    sortBy: u.searchParams.get('sortBy'),
    sortDirection: u.searchParams.get('sortDirection'),
    url
  }
}

async function mockAuth(page: Page, context: BrowserContext) {
  await context.addInitScript(token => {
    window.localStorage.setItem(
      'user',
      JSON.stringify({
        accessToken: token,
        refreshToken: token
      })
    )
  }, TEST_ACCESS_TOKEN)

  await page.route('**/auth/profile', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockProfile)
    })
  })
}

async function mockDashboardBase(page: Page) {
  await page.route('**/dashboard/order-stats**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        created: 2,
        shipped: 1,
        delivered: 1,
        cancelled: 0,
        total: 4
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
}

async function captureSortRequests(
  page: Page,
  urlPattern: string,
  responder: (route: Route, request: SortRequest) => Promise<void> | void
) {
  const requests: SortRequest[] = []

  await page.route(urlPattern, async route => {
    const sortRequest = getSortParamsFromUrl(route.request().url())
    requests.push(sortRequest)
    await responder(route, sortRequest)
  })

  return requests
}

const mockOrders = [
  {
    orderId: 'ORDER-1001',
    sId: 'S-1001',
    customerName: 'Ahmet Yılmaz',
    customerPhone: '5551234567',
    deliveryAddress: 'Test Mahallesi',
    isPrepaid: false,
    status: 'created',
    createdAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-02-10T10:10:00.000Z',
    totalAmount: 500,
    paymentType: 'cash',
    channel: 'manuel',
    courierInfo: null
  },
  {
    orderId: 'ORDER-1002',
    sId: 'S-1002',
    customerName: 'Mehmet Demir',
    customerPhone: '5551234568',
    deliveryAddress: 'Test Sokak',
    isPrepaid: true,
    status: 'shipped',
    createdAt: '2026-02-10T11:00:00.000Z',
    updatedAt: '2026-02-10T11:10:00.000Z',
    totalAmount: 320,
    paymentType: 'online',
    channel: 'manuel',
    courierInfo: { name: 'Kurye 1' }
  }
]

const mockReportRows = [
  {
    OrderId: 'R-1001',
    CreatedOn: '2026-02-10T10:00:00.000Z',
    customer_name: 'Ahmet Yılmaz',
    Status: 1,
    Name: 'Nakit',
    IsPrepaid: false,
    TotalAmount: 230
  },
  {
    OrderId: 'R-1002',
    CreatedOn: '2026-02-10T11:00:00.000Z',
    customer_name: 'Mehmet Demir',
    Status: 1,
    Name: 'Online',
    IsPrepaid: true,
    TotalAmount: 910
  }
]

const mockReconciliationRows = [
  {
    period: '1-7 Ocak 2026',
    totalOrderAmount: 1000,
    distributionCount: 10,
    totalDeliveryAmount: 100,
    totalBillAmount: 900,
    totalFoodCouponAmount: 50,
    totalPrePaidFoodCouponAmount: 0,
    totalPrePaidAmount: 0,
    restaurantPaymentAmount: 850,
    status: 'pending',
    RecordID: '1',
    RecordYear: 2026,
    RecordMonth: 1,
    RecordPeriod: 1,
    ConfirmID: '2',
    ConfirmStatus: 0,
    ConfirmDate: '2026-02-10T10:00:00.000Z',
    ConfirmNote: ''
  },
  {
    period: '1-7 Mart 2026',
    totalOrderAmount: 2000,
    distributionCount: 20,
    totalDeliveryAmount: 180,
    totalBillAmount: 1820,
    totalFoodCouponAmount: 110,
    totalPrePaidFoodCouponAmount: 0,
    totalPrePaidAmount: 0,
    restaurantPaymentAmount: 1710,
    status: 'pending',
    RecordID: '3',
    RecordYear: 2026,
    RecordMonth: 3,
    RecordPeriod: 1,
    ConfirmID: '4',
    ConfirmStatus: 0,
    ConfirmDate: '2026-02-10T11:00:00.000Z',
    ConfirmNote: ''
  }
]

function sortRows<T>(rows: T[], sortDirection: string | null, getValue: (row: T) => number | string) {
  const sorted = [...rows].sort((a, b) => {
    const aValue = getValue(a)
    const bValue = getValue(b)
    if (aValue === bValue) return 0
    return aValue > bValue ? 1 : -1
  })

  return sortDirection === 'DESC' ? sorted.reverse() : sorted
}

test.describe('FP-2186 sıralama davranışları', () => {
  test.beforeEach(async ({ page, context }) => {
    await mockAuth(page, context)
    await mockDashboardBase(page)
  })

  test('Sipariş tablo görünümünde kolon başlığından sıralama parametresi gönderilir', async ({ page }) => {
    const orderSortRequests = await captureSortRequests(page, '**/orders/order-list**', async (route, request) => {
      const sortedOrders =
        request.sortBy === 'totalAmount'
          ? sortRows(mockOrders, request.sortDirection, order => order.totalAmount)
          : sortRows(mockOrders, request.sortDirection, order => order.createdAt)

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          orders: sortedOrders,
          total: sortedOrders.length,
          page: 1,
          limit: 20
        })
      })
    })

    await page.goto('/orders')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('Oluşturulma Tarihi')).toBeVisible()
    await expect(page.locator('table tbody tr')).toHaveCount(2)
    await expect(page.locator('table tbody tr').first()).toContainText('Mehmet')
    await expect.poll(() => orderSortRequests.length).toBeGreaterThan(0)
    expect(orderSortRequests[0]?.sortBy).toBe('createdAt')
    expect(orderSortRequests[0]?.sortDirection).toBe('DESC')

    await page.getByRole('button', { name: /Tutar \(₺\)/i }).click()

    await expect.poll(() => orderSortRequests[orderSortRequests.length - 1]?.sortBy).toBe('totalAmount')
    await expect.poll(() => orderSortRequests[orderSortRequests.length - 1]?.sortDirection).toBe('DESC')
    await expect(page.locator('table tbody tr').first()).toContainText('Ahmet')
  })

  test('Sipariş kart görünümündeki sıralama bileşeni backend sort parametresi gönderir', async ({ page }) => {
    const orderSortRequests = await captureSortRequests(page, '**/orders/order-list**', async (route, request) => {
      const sortedOrders =
        request.sortBy === 'totalAmount'
          ? sortRows(mockOrders, request.sortDirection, order => order.totalAmount)
          : sortRows(mockOrders, request.sortDirection, order => order.createdAt)

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          orders: sortedOrders,
          total: sortedOrders.length,
          page: 1,
          limit: 20
        })
      })
    })

    await page.goto('/orders')
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: 'Kart Görünümü' }).click()
    await expect(page.locator('[class*="cursor-pointer"]').filter({ hasText: 'Ahmet' })).toBeVisible()
    await expect(page.locator('[class*="cursor-pointer"]').filter({ hasText: 'Mehmet' })).toBeVisible()
    await expect(page.getByTestId('order-sort-select')).toBeVisible()

    await page.getByTestId('order-sort-select').click()
    await page.getByText('Tutar').click()

    await expect.poll(() => orderSortRequests[orderSortRequests.length - 1]?.sortBy).toBe('totalAmount')
    await expect.poll(() => orderSortRequests[orderSortRequests.length - 1]?.sortDirection).toBe('DESC')
  })

  test('Raporlar tablosunda sıralama değişince backend sort parametresi güncellenir', async ({ page }) => {
    await page.route('**/orders/payment-methods', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    })

    const reportSortRequests = await captureSortRequests(
      page,
      '**/reconciliation/report-orders-by-restaurant**',
      async route => {
        const request = getSortParamsFromUrl(route.request().url())
        const sortedRows =
          request.sortBy === 'TotalAmount'
            ? sortRows(mockReportRows, request.sortDirection, row => row.TotalAmount)
            : sortRows(mockReportRows, request.sortDirection, row => row.CreatedOn)

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            rows: sortedRows,
            total: sortedRows.length
          })
        })
      }
    )

    await page.goto('/reports')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('Tamamlanan Siparişler')).toBeVisible()
    await expect(page.locator('table tbody tr')).toHaveCount(2)
    await expect.poll(() => reportSortRequests.length).toBeGreaterThan(0)
    expect(reportSortRequests[0]?.sortBy).toBe('CreatedOn')
    expect(reportSortRequests[0]?.sortDirection).toBe('DESC')
    await expect(page.locator('table tbody tr').first()).toContainText('R-1002')

    await page.getByRole('button', { name: /Tutar \(₺\)/i }).click()

    await expect.poll(() => reportSortRequests[reportSortRequests.length - 1]?.sortBy).toBe('TotalAmount')
    await expect.poll(() => reportSortRequests[reportSortRequests.length - 1]?.sortDirection).toBe('DESC')
    await expect(page.locator('table tbody tr').first()).toContainText('R-1002')

    await page.getByRole('button', { name: /Tutar \(₺\)/i }).click()
    await expect.poll(() => reportSortRequests[reportSortRequests.length - 1]?.sortDirection).toBe('ASC')
    await expect(page.locator('table tbody tr').first()).toContainText('R-1001')
  })

  test('Mutabakat tablosunda sıralama değişince backend sort parametresi gönderilir', async ({ page }) => {
    const reconciliationSortRequests = await captureSortRequests(
      page,
      '**/reconciliation/report-by-company**',
      async (route, request) => {
        const sortedRows =
          request.sortBy === 'period'
            ? sortRows(
                mockReconciliationRows,
                request.sortDirection,
                row => row.RecordYear * 10000 + row.RecordMonth * 100 + row.RecordPeriod
              )
            : mockReconciliationRows

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ rows: sortedRows })
        })
      }
    )

    await page.goto('/reconciliation')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('Kayıtlar')).toBeVisible()
    await expect(page.locator('table tbody tr')).toHaveCount(2)
    await expect.poll(() => reconciliationSortRequests.length).toBeGreaterThan(0)
    expect(reconciliationSortRequests[0]?.sortBy).toBe('period')
    expect(reconciliationSortRequests[0]?.sortDirection).toBe('DESC')
    await expect(page.locator('table tbody tr').first()).toContainText('1-7 Mart 2026')

    await page.getByRole('button', { name: 'Dönem' }).click()

    await expect.poll(() => reconciliationSortRequests[reconciliationSortRequests.length - 1]?.sortBy).toBeNull()
    await expect.poll(() => reconciliationSortRequests[reconciliationSortRequests.length - 1]?.sortDirection).toBeNull()
    await expect(page.locator('table tbody tr').first()).toContainText('1-7 Ocak 2026')

    await page.getByRole('button', { name: 'Dönem' }).click()
    await expect
      .poll(() => reconciliationSortRequests[reconciliationSortRequests.length - 1]?.sortDirection)
      .toBe('ASC')
    await expect(page.locator('table tbody tr').first()).toContainText('1-7 Ocak 2026')
  })
})
