import { expect, test } from '@playwright/test'

// Environment variable'lardan login bilgilerini al
const TEST_ACCOUNT_ID = process.env.TEST_ACCOUNT_ID || ''
const TEST_IDENTIFIER = process.env.TEST_IDENTIFIER || ''
const TEST_PASSWORD = process.env.TEST_PASSWORD || ''

test.use({ storageState: { cookies: [], origins: [] } })

test('OTP olmadan giriş akışı', async ({ page }) => {
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

  // Login sayfasına git
  await page.goto('/login')

  // Login formunun göründüğünü kontrol et
  await expect(page.getByPlaceholder('Hesap ID giriniz')).toBeVisible()
  await expect(page.getByPlaceholder('E-posta giriniz')).toBeVisible()
  await expect(page.getByPlaceholder('Şifrenizi giriniz')).toBeVisible()

  // Login form alanlarını doldur
  await page.getByPlaceholder('Hesap ID giriniz').fill(TEST_ACCOUNT_ID)
  await page.getByPlaceholder('E-posta giriniz').fill(TEST_IDENTIFIER)
  await page.getByPlaceholder('Şifrenizi giriniz').fill(TEST_PASSWORD)

  // Giriş Yap butonuna bas
  await page.getByRole('button', { name: /Giriş Yap/i }).click()

  // Masked phone number'ın görünmediğini kontrol et
  await expect(page.getByText(/Numarasına gelen 6 haneli kodu giriniz/i)).not.toBeVisible()

  // Başarılı giriş mesajını kontrol et (toast notification)
  await expect(page.locator('.Toastify__toast--success').getByText(/Başarılıyla giriş yaptınız/i)).toBeVisible({
    timeout: 5000
  })

  // Ana sayfaya yönlendirildiğini kontrol et
  await expect(page).toHaveURL('/', { timeout: 10000 })
})
