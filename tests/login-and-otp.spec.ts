import { expect, test } from '@playwright/test'

// Environment variable'lardan login bilgilerini al
const TEST_ACCOUNT_ID = process.env.TEST_ACCOUNT_ID || ''
const TEST_IDENTIFIER = process.env.TEST_IDENTIFIER || ''
const TEST_PASSWORD = process.env.TEST_PASSWORD || ''
const TEST_OTP_CODE = process.env.TEST_OTP_CODE || '123456'

test('OTP doğrulamalı giriş akışı', async ({ page }) => {
  // Login sayfasına git
  await page.goto('/login')

  // Login formunun göründüğünü kontrol et
  await expect(page.getByPlaceholder('Hesap ID giriniz')).toBeVisible()
  await expect(page.getByPlaceholder('E-posta veya kullanıcı adı giriniz')).toBeVisible()
  await expect(page.getByPlaceholder('Şifrenizi giriniz')).toBeVisible()

  // Login form alanlarını doldur
  await page.getByPlaceholder('Hesap ID giriniz').fill(TEST_ACCOUNT_ID)
  await page.getByPlaceholder('E-posta veya kullanıcı adı giriniz').fill(TEST_IDENTIFIER)
  await page.getByPlaceholder('Şifrenizi giriniz').fill(TEST_PASSWORD)

  // Giriş Yap butonuna bas
  await page.getByRole('button', { name: /Giriş Yap/i }).click()

  // OTP ekranına geçiş yapıldığını kontrol et
  await expect(page.getByRole('heading', { name: /Doğrulama Kodu/i })).toBeVisible({ timeout: 5000 })

  // Masked phone number'ın göründüğünü kontrol et
  await expect(page.getByText(/Numarasına gelen 6 haneli kodu giriniz/i)).toBeVisible()

  // OTP alanlarına yanlış kod gir (123123)
  const otpInputs = page.locator('input[type="text"][inputmode="numeric"]')
  const wrongOtp = '123123'
  for (let i = 0; i < 6; i++) {
    await otpInputs.nth(i).fill(wrongOtp[i])
  }

  // Gönder butonuna bas
  await page.getByRole('button', { name: /Gönder/i }).click()

  // Hata mesajının göründüğünü kontrol et (toast notification)
  await expect(page.locator('.Toastify__toast--error').getByText(/Kod geçersiz/i)).toBeVisible({ timeout: 5000 })

  // OTP alanlarını temizle ve doğru kod gir (123456)
  for (let i = 0; i < 6; i++) {
    await otpInputs.nth(i).clear()
  }

  const correctOtp = '123456'
  for (let i = 0; i < 6; i++) {
    await otpInputs.nth(i).fill(correctOtp[i])
  }

  // Gönder butonuna bas
  await page.getByRole('button', { name: /Gönder/i }).click()

  // Başarılı giriş mesajını kontrol et (toast notification)
  await expect(page.locator('.Toastify__toast--success').getByText(/Başarılıyla giriş yaptınız/i)).toBeVisible({
    timeout: 5000
  })

  // Ana sayfaya yönlendirildiğini kontrol et
  await expect(page).toHaveURL('/', { timeout: 10000 })
})

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
  await expect(page.getByPlaceholder('E-posta veya kullanıcı adı giriniz')).toBeVisible()
  await expect(page.getByPlaceholder('Şifrenizi giriniz')).toBeVisible()

  // Login form alanlarını doldur
  await page.getByPlaceholder('Hesap ID giriniz').fill(TEST_ACCOUNT_ID)
  await page.getByPlaceholder('E-posta veya kullanıcı adı giriniz').fill(TEST_IDENTIFIER)
  await page.getByPlaceholder('Şifrenizi giriniz').fill(TEST_PASSWORD)

  // Giriş Yap butonuna bas
  await page.getByRole('button', { name: /Giriş Yap/i }).click()

  // OTP ekranının görünmediğini kontrol et
  await expect(page.getByRole('heading', { name: /Doğrulama Kodu/i })).not.toBeVisible()

  // Başarılı giriş mesajını kontrol et (toast notification)
  await expect(page.locator('.Toastify__toast--success').getByText(/Başarılıyla giriş yaptınız/i)).toBeVisible({
    timeout: 5000
  })

  // Ana sayfaya yönlendirildiğini kontrol et
  await expect(page).toHaveURL('/', { timeout: 10000 })
})
