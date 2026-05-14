import type { IProfileFinancialDetails } from '@/types/profile'
import { expect, tenantTest as test } from '../../playwright/fixtures/authenticated'
import { buildTenantProfile } from './tenant-profile-api-mock'

const tinyPdfFile = Buffer.from(
  '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj\nxref\n0 4\ntrailer<</Size 4/Root 1 0 R>>\n%%EOF'
)

const completedFinancialDetails: IProfileFinancialDetails = {
  companyType: 'Bireysel',
  companyName: 'Welcome Test Şirketi',
  taxOffice: 'Kadıköy',
  iban: 'TR330006100519786457841326',
  tckn: '12345678901',
  taxDocumentUrl: 'https://example.com/tax',
  signatureCircularUrl: null,
  idFrontUrl: 'https://example.com/idf',
  idBackUrl: 'https://example.com/idb'
}

test.describe('Tenant finansal onboarding', () => {
  test('Hoş geldin akışından finansal bilgileri kaydeder ve başvuru formuna yönlendirir (mock API)', async ({
    page
  }) => {
    let financialDetailsSaved = false

    await page.route('**/auth/profile', async route => {
      if (route.request().method() !== 'GET') {
        await route.fallback()
        return
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(buildTenantProfile(financialDetailsSaved ? completedFinancialDetails : null))
      })
    })

    await page.route('**/merchant/store/financial-details', async route => {
      if (route.request().method() !== 'POST') {
        await route.continue()
        return
      }
      financialDetailsSaved = true
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      })
    })

    await page.route('**/merchant/store/upload**', async route => {
      const url = new URL(route.request().url())
      const docType = url.searchParams.get('docType') ?? 'unknown'
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ key: `welcome-mock-${docType}`, url: 'https://example.com/mock' })
      })
    })

    await page.goto('/business-setup')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/business-setup/, { timeout: 15000 })
    await expect(page.getByRole('heading', { name: /Hoş Geldin/i })).toBeVisible({ timeout: 15000 })

    await page.getByTestId('business-setup-next-button').click()
    await page.getByTestId('business-setup-next-button').click()
    await page.getByTestId('business-setup-start-button').click()

    await expect(page.locator('input[name="companyName"]')).toBeVisible({ timeout: 10000 })
    await page.getByTestId('business-info-account-type-tenant').click()
    await page.locator('input[name="companyName"]').fill('Welcome Test Şirketi')
    await page.locator('input[name="taxOffice"]').first().fill('Kadıköy V.D.')
    await page.locator('input[name="tckn"]').fill('12345678901')
    await page.locator('input[name="iban"]').fill('330006100519786457841326')

    const fileInputs = page.locator('input[type="file"]')
    await expect(fileInputs).toHaveCount(4)
    await fileInputs.nth(0).setInputFiles({ name: 'vergi.pdf', mimeType: 'application/pdf', buffer: tinyPdfFile })
    await fileInputs.nth(1).setInputFiles({ name: 'kimlik-on.pdf', mimeType: 'application/pdf', buffer: tinyPdfFile })
    await fileInputs
      .nth(2)
      .setInputFiles({ name: 'kimlik-arka.pdf', mimeType: 'application/pdf', buffer: tinyPdfFile })

    await page.getByRole('button', { name: 'Kaydet ve Devam Et' }).click()

    await expect(page.locator('.Toastify__toast--success').getByText(/başarıyla kaydedildi/i)).toBeVisible({
      timeout: 15000
    })
    await expect(page).toHaveURL(/\/applications\/new/, { timeout: 15000 })
  })
})
