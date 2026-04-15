import type { Locator } from '@playwright/test'
import { expect, tenantTest as test, type Page } from '../../playwright/fixtures/authenticated'
import { mockTenantProfileWithCompletedFinance } from './tenant-profile-api-mock'

/** RHF + IMask çalışma saati alanı — değer 4 haneli string (örn. 0900) */
async function fillWorkingHourDigits(input: Locator, digits: string) {
  await input.click()
  await input.fill(digits) // örn. '18:00', '09:00'
}

async function fillLocationStep(page: Page) {
  const sehirInput = page.locator('input[name="city.id"]')
  await sehirInput.click()
  await sehirInput.fill('İstanbul')
  await page.waitForSelector('[cmdk-item]', { timeout: 5000 })
  await page.locator('[cmdk-item]').filter({ hasText: 'İstanbul' }).click()

  const ilceInput = page.locator('input[name="county.id"]')
  await expect(ilceInput).toBeEnabled({ timeout: 5000 })
  await ilceInput.click()
  await ilceInput.fill('Kadıköy')
  await page.waitForSelector('[cmdk-item]', { timeout: 5000 })
  await page.locator('[cmdk-item]').filter({ hasText: 'Kadıköy' }).click()

  const mahalleInput = page.locator('input[name="district.id"]')
  await expect(mahalleInput).toBeEnabled({ timeout: 5000 })
  await mahalleInput.click()
  await mahalleInput.fill('Caferağa')
  await page.waitForSelector('[cmdk-item]', { timeout: 5000 })
  await page.locator('[cmdk-item]').filter({ hasText: 'Caferağa' }).click()

  const sokakInput = page.locator('input[name="street"]')
  await expect(sokakInput).toBeEnabled({ timeout: 5000 })
  await sokakInput.click()
  await sokakInput.fill('Moda')
  await page.waitForSelector('[cmdk-item]', { timeout: 5000 })
  await page
    .locator('[cmdk-item]')
    .filter({ hasText: /Moda Caddesi/i })
    .click()

  await page.locator('input[name="doorNumber"]').fill('12')
}

test.describe('Yeni başvuru oluşturma', () => {
  test('Wizard: doğrulamalar ve başarılı gönderim (mock API)', async ({ page }) => {
    await mockTenantProfileWithCompletedFinance(page)

    await page.route('**/location/provinces', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ il_id: 34, il_adi: 'İstanbul', CityId: 'city-guid-34' }])
      })
    })

    await page.route('**/location/query-address**', async route => {
      const url = new URL(route.request().url())
      if (url.searchParams.get('type') === 'county' && url.searchParams.get('provinceId') === '34') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              il_id: 34,
              il_adi: 'İstanbul',
              ilce_id: 1,
              ilce_adi: 'Kadıköy',
              CityId: 'city-guid-34',
              CountyId: 'county-guid-1'
            }
          ])
        })
        return
      }
      if (url.searchParams.get('type') === 'district' && url.searchParams.get('countyId') === '1') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{ il_id: 34, il_adi: 'İstanbul', mahalle_id: 10, mahalle_adi: 'Caferağa Mahallesi' }])
        })
        return
      }
      if (url.searchParams.get('type') === 'street' && url.searchParams.get('districtId') === '10') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              il_id: 34,
              il_adi: 'İstanbul',
              mahalle_id: 10,
              mahalle_adi: 'Caferağa Mahallesi',
              sokak_id: 100,
              sokak_adi: 'Moda Caddesi'
            }
          ])
        })
        return
      }
      await route.continue()
    })

    await page.route('**/merchant/store/sectors', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [{ sector: 'Restoran', subSectors: ['Fast Food'] }]
        })
      })
    })

    await page.route('**/merchant-prices/resolve**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ found: true, minPrice: 50 })
      })
    })

    await page.route('**/merchant/store/applications', async route => {
      if (route.request().method() !== 'POST') {
        await route.continue()
        return
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          storeApplicationId: 'test-app-1',
          status: 'PENDING',
          message: 'OK'
        })
      })
    })

    await page.goto('/applications/new')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/applications\/new/, { timeout: 15000 })

    // --- Adım 1: Konum — boş gönderilemez
    await page.getByRole('button', { name: 'Devam Et' }).click()
    await expect(page.getByPlaceholder('İl seçin')).toBeVisible()

    await fillLocationStep(page)
    await page.getByRole('button', { name: 'Devam Et' }).click()

    // --- Adım 2: Şube — boş gönderilemez
    await expect(page.getByPlaceholder('Şube adı')).toBeVisible({ timeout: 10000 })
    await page.getByRole('button', { name: 'Devam Et' }).click()
    await expect(page.getByPlaceholder('Şube adı')).toBeVisible()

    await page.locator('input[name="restaurantName"]').fill('Test Şubesi')
    await page.locator('#sector').click()
    await page.getByRole('option', { name: 'Restoran' }).click()

    // Alt sektör seçilmeden
    await page.getByRole('button', { name: 'Devam Et' }).click()
    await expect(page.getByText('En az bir alt sektör zorunludur')).toBeVisible()

    await page.getByRole('checkbox', { name: 'Fast Food' }).click()
    await page.locator('input[name="dailyPackageEstimate"]').fill('150')
    await page.locator('input[name="authFirstName"]').fill('Ahmet')
    await page.locator('input[name="authSurname"]').fill('Yılmaz')

    // Cep: Zod önce .length(9,'') — kısa numarada mesaj boş, FormMessage görünmez;
    // mask (MOBILE_PHONE_REGEX) zaten geçersiz karakterleri engelliyor. Doğrudan geçerli 9 hane.
    const phoneInput = page.locator('input[name="authPhoneNumber"]')
    await phoneInput.click()
    await phoneInput.fill('')
    await phoneInput.pressSequentially('321234562', { delay: 20 })

    // Geçersiz e-posta
    await page.locator('input[name="authEmail"]').fill('gecersiz')
    await page.getByRole('button', { name: 'Devam Et' }).click()
    await expect(page.getByText('Geçerli e-posta giriniz')).toBeVisible()

    await page.locator('input[name="authEmail"]').fill('yetkili@test.com')
    await page.getByRole('button', { name: 'Devam Et' }).click()

    // --- Adım 3: Çalışma saatleri
    const wh = page.getByTestId('store-application-working-hours')
    await expect(wh).toBeVisible({ timeout: 10000 })

    const monStart = wh.locator('input[name="workingHours.0.intervals.0.start"]')
    const monEnd = wh.locator('input[name="workingHours.0.intervals.0.end"]')

    // Bitiş ≤ başlangıç
    await fillWorkingHourDigits(monStart, '18:00')
    await fillWorkingHourDigits(monEnd, '09:00')
    await page.getByRole('button', { name: 'Kaydet' }).click()
    await expect(wh.getByText('Bitiş saati başlangıç saatinden sonra olmalıdır')).toBeVisible({ timeout: 5000 })

    await fillWorkingHourDigits(monStart, '09:00')
    await fillWorkingHourDigits(monEnd, '22:00')

    // İki aralık: ikinci başlangıç, birincinin bitişinden önce
    await wh.getByTestId('monday-add-interval').click()
    const monStart2 = wh.locator('input[name="workingHours.0.intervals.1.start"]')
    const monEnd2 = wh.locator('input[name="workingHours.0.intervals.1.end"]')
    await fillWorkingHourDigits(monStart2, '10:00')
    await fillWorkingHourDigits(monEnd2, '11:00')
    await page.getByRole('button', { name: 'Kaydet' }).click()
    await expect(wh.getByText('Başlangıç saati önceki aralığın bitişinden büyük olmalıdır')).toBeVisible({
      timeout: 5000
    })

    await fillWorkingHourDigits(monStart2, '23:00')
    await fillWorkingHourDigits(monEnd2, '23:30')

    await wh.getByTestId('monday-apply-to-all').click()
    await page.getByRole('button', { name: 'Kaydet' }).click()

    await expect(page.locator('.Toastify__toast--success').getByText(/Başvurunuz alındı/i)).toBeVisible({
      timeout: 15000
    })
    await expect(page).toHaveURL(/\/applications$/, { timeout: 10000 })
  })
})
