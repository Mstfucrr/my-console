import { expect, test } from '@playwright/test'

test.describe('Mutabakat işlemleri (Onayla / Kontrole Gönder)', () => {
  test('Onayla: fatura yüklenir ve confirmation-process çağrılır (mock)', async ({ page }) => {
    const record = {
      RecordID: '1001',
      period: '2026-01',
      totalOrderAmount: 1000,
      distributionCount: 10,
      totalDeliveryAmount: 100,
      restaurantPaymentAmount: 900,
      totalBillAmount: 950,
      totalFoodCouponAmount: 0,
      totalPrePaidAmount: 0,
      totalPrePaidFoodCouponAmount: 0,
      status: 'pending',
      RestaurantTaxNumber: '1111111111',
      RecordYear: 2026,
      RecordMonth: 1,
      RecordPeriod: 1,
      ConfirmID: '2002',
      ConfirmStatus: 0,
      ConfirmNote: '',
      ConfirmDate: new Date().toISOString()
    }

    await page.route('**/reconciliation/report-by-company**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ rows: [record] })
      })
    })

    let uploadPayload: any = null
    await page.route('**/reconciliation/upload-s3**', async route => {
      uploadPayload = route.request().postDataJSON()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ statusCode: 200, message: 'ok', url: 'https://example.com/invoice.pdf' })
      })
    })

    let confirmationPayload: any = null
    await page.route('**/reconciliation/confirmation-process**', async route => {
      confirmationPayload = route.request().postDataJSON()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'ok', affectedRows: 1 })
      })
    })

    await page.goto('/reconciliation')
    await page.waitForLoadState('networkidle')

    // Mutabakat kaydı bulunamadı mesajı görünmemeli
    await expect(page.getByText('Mutabakat kaydı bulunamadı')).not.toBeVisible()

    // Mutabakat kaydı bulunamadı mesajı görünmemeli
    await expect(page.getByText('Mutabakat kaydı bulunamadı')).not.toBeVisible()

    await page.getByRole('button', { name: /^Onayla$/ }).click()

    const modal = page.locator('[role="alertdialog"]').filter({ hasText: 'Mutabakat Onayı' })
    await expect(modal).toBeVisible()

    await modal.locator('form input[type="file"]').setInputFiles({
      name: 'invoice.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\n%mock\n')
    })

    await modal.getByRole('button', { name: /Faturayı Gönder/i }).click()

    await expect(page.getByText('Fatura yüklendi ve mutabakat başarıyla onaylandı')).toBeVisible({ timeout: 10000 })

    expect(uploadPayload?.fileName).toBe('invoice.pdf')
    expect(typeof uploadPayload?.fileBuffer).toBe('string')
    expect(uploadPayload?.mimetype).toBe('application/pdf')

    expect(confirmationPayload?.recordID).toBe(1001)
    expect(confirmationPayload?.confirmRecordID).toBe(2002)
    expect(confirmationPayload?.confirmStatus).toBe(1) // APPROVED
    expect(confirmationPayload?.fileName).toBe('invoice.pdf')
  })

  test('Kontrole Gönder: açıklama + dosya ile confirmation-process çağrılır (mock)', async ({ page }) => {
    const record = {
      RecordID: '1002',
      period: '2026-01',
      totalOrderAmount: 1000,
      distributionCount: 10,
      totalDeliveryAmount: 100,
      restaurantPaymentAmount: 900,
      totalBillAmount: 950,
      totalFoodCouponAmount: 0,
      totalPrePaidAmount: 0,
      totalPrePaidFoodCouponAmount: 0,
      status: 'pending',
      RestaurantTaxNumber: '1111111111',
      RecordYear: 2026,
      RecordMonth: 1,
      RecordPeriod: 1,
      ConfirmID: '2003',
      ConfirmStatus: 0,
      ConfirmNote: '',
      ConfirmDate: new Date().toISOString()
    }

    await page.route('**/reconciliation/report-by-company**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ rows: [record] })
      })
    })

    await page.route('**/reconciliation/upload-s3**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ statusCode: 200, message: 'ok', url: 'https://example.com/statement.pdf' })
      })
    })

    let confirmationPayload: any = null
    await page.route('**/reconciliation/confirmation-process**', async route => {
      confirmationPayload = route.request().postDataJSON()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'ok', affectedRows: 1 })
      })
    })

    await page.goto('/reconciliation')
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: /^Kontrole Gönder$/ }).click()

    const modal = page.locator('[role="alertdialog"]').filter({ hasText: 'Kontrole Gönder' })
    await expect(modal).toBeVisible()

    await modal
      .getByPlaceholder('Neden mutabık olmadığınızı belirtiniz')
      .fill('Test: veriyi etkilemeyen kontrol bildirimi')

    await modal.locator('form input[type="file"]').setInputFiles({
      name: 'statement.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\n%mock\n')
    })

    await modal.getByRole('button', { name: /Mutabık Olmadığınızı Bildirin/i }).click()

    await expect(page.getByText('Mutabık olmadığınızın bildirimi başarıyla yapıldı')).toBeVisible({ timeout: 10000 })

    expect(confirmationPayload?.recordID).toBe(1002)
    expect(confirmationPayload?.confirmRecordID).toBe(2003)
    expect(confirmationPayload?.confirmStatus).toBe(2) // FAILED
    expect(confirmationPayload?.note).toBe('Test: veriyi etkilemeyen kontrol bildirimi')
    expect(confirmationPayload?.fileName).toBe('statement.pdf')
  })
})
