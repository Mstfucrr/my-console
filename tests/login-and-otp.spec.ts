import { expect, test } from '@playwright/test'

test('OTP doğrulamalı giriş akışı', async ({ page }) => {
  // Login sayfasına git
  await page.goto('/login')

  // Login formunun göründüğünü kontrol et
  await expect(page.getByRole('heading', { name: /Partner'a Hoşgeldiniz/i })).toBeVisible()
  await expect(page.getByPlaceholder('E-posta giriniz')).toBeVisible()
  await expect(page.getByPlaceholder('Şifrenizi giriniz')).toBeVisible()

  // Giriş Yap butonuna bas
  await page.getByRole('button', { name: /Giriş Yap/i }).click()

  // OTP ekranına geçiş yapıldığını kontrol et
  await expect(page.getByRole('heading', { name: /Doğrulama Kodu/i })).toBeVisible()

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
