import { expect, test } from '@playwright/test'

const mockOrder = {
  orderId: 'ORDER-PRINT-1',
  sId: 'S-1',
  customerName: 'Test Müşteri',
  customerPhone: '5551112233',
  deliveryAddress: 'Test Adres',
  addressDirection: '-',
  customerNote: '-',
  status: 'created',
  createdAt: new Date().toISOString(),
  totalAmount: 99.9,
  paymentType: 'cash',
  channel: 'console'
}

test.describe('Sipariş makbuz yazdır', () => {
  test('Yazdır butonu makbuz diyaloğunu açar ve yazdırma tetiklenir', async ({ page }) => {
    await page.route('**/orders/order-list**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ orders: [mockOrder], total: 1 })
      })
    })
    await page.route(`**/orders/order/${mockOrder.orderId}`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOrder)
      })
    })

    await page.goto('/orders')
    await page.waitForLoadState('networkidle')

    await page.locator('table tbody tr').first().click()
    await expect(page.getByText('Sipariş Detayları')).toBeVisible({ timeout: 10000 })

    await page.getByRole('button', { name: 'Yazdır' }).first().click()
    const receiptDialog = page.getByRole('dialog').filter({ hasText: 'Detay' })
    await expect(receiptDialog).toBeVisible()

    await page.evaluate(() => {
      ;(window as any).print = () => {}
    })
    await receiptDialog.getByRole('button', { name: 'Yazdır' }).click()

    await expect(page.locator('#order-receipt-print-container')).toBeVisible()
    await expect(page.locator('body')).toHaveAttribute('data-receipt-printing', 'true')
  })
})
