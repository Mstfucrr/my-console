import { expect, test } from '@playwright/test'

test('logout sonrası restoran bilgisi değişir (cache temiz)', async ({ page }) => {
  const userA = { token: 'tokenA', restaurant: 'Restoran A' }
  const userB = { token: 'tokenB', restaurant: 'Restoran B' }

  let loginCount = 0
  let profileCallCount = 0

  await page.route('**/auth/login', async route => {
    loginCount += 1
    const user = loginCount === 1 ? userA : userB
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        accessToken: user.token,
        userId: loginCount === 1 ? 'user-a' : 'user-b',
        accountId: loginCount === 1 ? '111' : '222',
        requiresOtp: false
      })
    })
  })

  await page.route('**/auth/logout', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
  })

  await page.route('**/auth/profile', async route => {
    profileCallCount += 1
    const auth = route.request().headers()['authorization'] ?? ''
    const user = auth.includes(userA.token) ? userA : userB

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        userId: auth.includes(userA.token) ? 'user-a' : 'user-b',
        accountId: auth.includes(userA.token) ? '111' : '222',
        email: auth.includes(userA.token) ? 'a@test.dev' : 'b@test.dev',
        restaurantId: auth.includes(userA.token) ? 'rest-a' : 'rest-b',
        omsRestaurantId: auth.includes(userA.token) ? 'oms-a' : 'oms-b',
        info: {
          externalId: 'ext',
          accountId: auth.includes(userA.token) ? '111' : '222',
          channelId: 'ch',
          lng: 0,
          brandId: 'br',
          channelRestaurantId: 'chr',
          createdAt: Date.now(),
          id: 'info',
          lat: 0,
          name: user.restaurant,
          state: 'active',
          isAtaExpressActive: false,
          hubId: 'hub',
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
      })
    })
  })

  // Home dashboard çağrılarını mock'la (aksi halde 401/redirect ile test flaky olur)
  await page.route('**/dashboard/order-stats**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ total: 0, created: 0, shipped: 0, delivered: 0, cancelled: 0 })
    })
  })

  await page.route('**/dashboard/latest-orders**', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ orders: [] }) })
  })

  const fillLoginFormAndSubmit = async (accountId: string, email: string) => {
    await page.getByTestId('login-form-account-type-button-store').click()
    const hesapIdInput = page.getByPlaceholder('Hesap ID')
    await expect(hesapIdInput).toBeVisible()
    await hesapIdInput.fill(accountId)
    await page.getByPlaceholder('E-posta').fill(email)
    await page.getByPlaceholder('Şifre').fill('pw')
    await page.getByRole('button', { name: /Giriş Yap/i }).click()
    await expect(page).toHaveURL('/', { timeout: 10000 })
  }

  const firstLogin = async (accountId: string, email: string) => {
    await page.goto('/login')
    await fillLoginFormAndSubmit(accountId, email)
  }

  const logout = async () => {
    // Profil menüsünü aç (ikon-only buton)
    await page.getByTestId('profile-menu-button').click()

    // Logout (test id ile)
    await page.getByTestId('logout-button').click()
    await page.getByTestId('logout-confirm').click()
    await expect(page).toHaveURL(/\/login(\?|$)/, { timeout: 10000 })
  }

  await firstLogin('111', 'a@test.dev')
  await expect(page.getByRole('heading', { name: userA.restaurant })).toBeVisible()
  await expect.poll(() => profileCallCount).toBeGreaterThanOrEqual(1)

  await logout()

  // 2. login: SAYFA RELOAD YOK (cache bug'ını yakalamak için kritik)
  await fillLoginFormAndSubmit('222', 'b@test.dev')
  await expect(page.getByRole('heading', { name: userA.restaurant })).not.toBeVisible()

  // Cache temizliği işe yarıyorsa profile en az 2 kez çağrılmış olmalı (A + B)
  await expect(profileCallCount).toBeGreaterThanOrEqual(2)
})
