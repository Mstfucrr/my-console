import { expect, test, type Page } from '@playwright/test'

/** Mirrors `OnboardingContext` — token is persisted here (not localStorage/cookies). */
const PASSWORD_SETUP_TOKEN_STORAGE_KEY = 'tenant-onboarding-password-setup-token'

async function fillOtpInputs(page: Page, code: string) {
  const otpInputs = page.locator('input[name^="otp"]')
  await expect(otpInputs).toHaveCount(code.length)

  for (const [index, digit] of code.split('').entries()) {
    await otpInputs.nth(index).fill(digit)
  }
}

test.describe('Tenant onboarding başvurusu', () => {
  test('Şube başvuru formu onboarding akışı (mock API)', async ({ page }) => {
    const sessionId = 'tenant-session-1'
    const passwordSetupToken = 'password-token-1'
    const otpCode = '123456'

    let submitApplicationPayload: Record<string, unknown> | null = null
    const sentOtpPayloads: Array<Record<string, unknown>> = []
    const verifiedOtpPayloads: Array<Record<string, unknown>> = []
    let completeApplicationPayload: Record<string, unknown> | null = null
    let passwordSetupPayload: Record<string, unknown> | null = null

    const newPassword = 'Secure1!x'

    await page.route('**/merchant', async route => {
      if (route.request().method() !== 'POST') {
        await route.continue()
        return
      }

      submitApplicationPayload = route.request().postDataJSON() as Record<string, unknown>

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ sessionId })
      })
    })

    await page.route('**/merchant/otp/send', async route => {
      if (route.request().method() !== 'POST') {
        await route.continue()
        return
      }

      const payload = route.request().postDataJSON() as Record<string, unknown>
      sentOtpPayloads.push(payload)

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          channel: payload.channel,
          expiresInSeconds: 60,
          message: 'OTP sent'
        })
      })
    })

    await page.route('**/merchant/otp/verify', async route => {
      if (route.request().method() !== 'POST') {
        await route.continue()
        return
      }

      const payload = route.request().postDataJSON() as Record<string, unknown>
      verifiedOtpPayloads.push(payload)

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          channel: payload.channel,
          verified: true,
          allChannelsVerified: verifiedOtpPayloads.length >= 2
        })
      })
    })

    await page.route('**/merchant/complete', async route => {
      if (route.request().method() !== 'POST') {
        await route.continue()
        return
      }

      completeApplicationPayload = route.request().postDataJSON() as Record<string, unknown>

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          tenantId: 'tenant-1',
          passwordSetupLink: `https://example.com/onboarding/set-password?token=${passwordSetupToken}`,
          passwordSetupToken,
          expiresAt: '2026-12-31T23:59:59.000Z'
        })
      })
    })

    await page.route('**/merchant/password-setup', async route => {
      if (route.request().method() !== 'POST') {
        await route.continue()
        return
      }

      passwordSetupPayload = route.request().postDataJSON() as Record<string, unknown>

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Şifreniz başarıyla belirlendi.'
        })
      })
    })

    await page.goto('/onboarding')

    await expect(page.getByRole('heading', { name: 'Başvuru Formu' })).toBeVisible()
    await expect(page.getByText('İletişim Bilgileri')).toBeVisible()
    await expect(page.getByText('Doğrulama')).toBeVisible()

    await page.locator('input[name="firstName"]').fill('Ahmet')
    await page.locator('input[name="surname"]').fill('Yılmaz')
    await page.locator('input[name="phoneNumber"]').fill('321234562')
    await page.locator('input[name="email"]').fill('yetkili@test.com')
    await page.locator('input[name="taxNumber"]').fill('1234567890')
    await page.getByRole('checkbox').click()

    await page.getByRole('button', { name: 'Devam Et' }).click()

    await expect(page.locator('.Toastify__toast--success')).toContainText(
      'Başvurunuzu tamamlamak için lütfen telefon ve e-posta doğrulamasını tamamlayınız',
      { timeout: 10000 }
    )
    expect(submitApplicationPayload).toEqual({
      firstName: 'Ahmet',
      surname: 'Yılmaz',
      phoneNumber: '5321234562',
      email: 'yetkili@test.com',
      taxNumber: '1234567890'
    })

    const phoneVerificationCard = page.getByTestId('onboarding-telefon-numaranı-doğrula-item')
    const emailVerificationCard = page.getByTestId('onboarding-e-posta-doğrula-item')

    await expect(phoneVerificationCard).toBeVisible()
    await expect(emailVerificationCard).toBeVisible()

    await page.getByTestId('telefon-numaranı-doğrula-button').click()

    await expect(page.getByRole('heading', { name: 'Telefon Numarası Doğrulama' })).toBeVisible()
    await fillOtpInputs(page, otpCode)
    await page.getByRole('button', { name: 'Doğrula' }).click()

    await expect(page.getByText('Telefon numaranız başarıyla doğrulandı.')).toBeVisible({ timeout: 10000 })
    await expect(phoneVerificationCard.getByRole('button', { name: 'Doğrulandı' })).toBeVisible()

    await page.getByTestId('e-posta-doğrula-button').click()

    await expect(page.getByRole('heading', { name: 'E-Posta Doğrulama' })).toBeVisible()
    await fillOtpInputs(page, otpCode)
    await page.getByRole('button', { name: 'Doğrula' }).click()

    await expect(page.getByText('E-posta adresiniz başarıyla doğrulandı.')).toBeVisible({ timeout: 10000 })
    await expect(emailVerificationCard.getByRole('button', { name: 'Doğrulandı' })).toBeVisible()

    expect(sentOtpPayloads).toEqual([
      { sessionId, channel: 'phone' },
      { sessionId, channel: 'email' }
    ])
    expect(verifiedOtpPayloads).toEqual([
      { sessionId, channel: 'phone', code: otpCode },
      { sessionId, channel: 'email', code: otpCode }
    ])

    const completeButton = page.getByTestId('onboarding-complete-application-button')
    await expect(completeButton).toBeEnabled()
    await completeButton.click()

    await expect(page.getByRole('heading', { name: 'Başarılı' })).toBeVisible()
    // Redirect includes `token` briefly; client strips it from the URL and keeps the token in sessionStorage.
    await expect(page).toHaveURL(/\/onboarding\?success=true$/, { timeout: 10000 })
    await expect
      .poll(() => page.evaluate((key: string) => sessionStorage.getItem(key), PASSWORD_SETUP_TOKEN_STORAGE_KEY))
      .toBe(passwordSetupToken)

    await expect(page.getByRole('link', { name: 'Şifre Belirle' })).toBeVisible()

    expect(completeApplicationPayload).toEqual({ sessionId })

    await page.getByRole('link', { name: 'Şifre Belirle' }).click()
    await expect(page).toHaveURL(/\/onboarding\/set-password/)

    await expect(page.getByRole('heading', { name: 'Şifre Belirle' })).toBeVisible()
    await expect(page.getByText('Aşağıdaki alanda şifrenizi belirleyiniz.')).toBeVisible()

    await page.locator('input[name="password"]').fill(newPassword)
    await page.locator('input[name="confirmPassword"]').fill(newPassword)

    const savePasswordButton = page.getByRole('button', { name: 'Şifreyi Kaydet' })
    await expect(savePasswordButton).toBeEnabled()
    await savePasswordButton.click()

    await expect(page.getByRole('heading', { name: 'Şifreniz Başarıyla Belirlendi' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Giriş Ekranına Git' })).toBeVisible()

    expect(passwordSetupPayload).toEqual({
      passwordSetupToken,
      password: newPassword
    })

    await expect
      .poll(() => page.evaluate((key: string) => sessionStorage.getItem(key), PASSWORD_SETUP_TOKEN_STORAGE_KEY))
      .toBeNull()
  })
})
