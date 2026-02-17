import { expect, type BrowserContext, type Page } from '@playwright/test'

type EnsureLoggedInArgs = {
  page: Page
  context: BrowserContext
  /**
   * Auth state set edildikten sonra açılacak ilk sayfa.
   * Token geçerliliğinin route guard'lar tarafından doğrulanmasını istiyorsanız
   * protected bir route verin (örn. `/orders/create`).
   */
  startPath?: string
}

const TEST_ACCOUNT_ID = process.env.TEST_ACCOUNT_ID || ''
const TEST_IDENTIFIER = process.env.TEST_IDENTIFIER || ''
const TEST_PASSWORD = process.env.TEST_PASSWORD || ''
const TEST_ACCESS_TOKEN = process.env.TEST_ACCESS_TOKEN || ''

function isLoginPageUrl(urlString: string) {
  try {
    const url = new URL(urlString)
    return url.pathname === '/login'
  } catch {
    // Playwright nadiren relatif URL döndürürse string kontrolüne düş.
    return urlString.includes('/login')
  }
}

async function waitForPossibleRedirectToLogin(page: Page) {
  // AuthGuard client-side navigation ile /login'e yönlendirebilir; biraz zaman tanı.
  try {
    await page.waitForURL(/\/login(\?|$)/, { timeout: 2000 })
  } catch {
    // yönlendirme yoksa sorun değil
  }
}

async function loginViaUi(page: Page) {
  if (!TEST_ACCOUNT_ID || !TEST_IDENTIFIER || !TEST_PASSWORD) {
    throw new Error(
      'Test kimlik bilgileri eksik. TEST_ACCOUNT_ID, TEST_IDENTIFIER ve TEST_PASSWORD set edin (veya geçerli bir TEST_ACCESS_TOKEN sağlayın).'
    )
  }

  await expect(page.getByPlaceholder('Hesap ID giriniz')).toBeVisible()
  await expect(page.getByPlaceholder('E-posta giriniz')).toBeVisible()
  await expect(page.getByPlaceholder('Şifrenizi giriniz')).toBeVisible()

  await page.getByPlaceholder('Hesap ID giriniz').fill(TEST_ACCOUNT_ID)
  await page.getByPlaceholder('E-posta giriniz').fill(TEST_IDENTIFIER)
  await page.getByPlaceholder('Şifrenizi giriniz').fill(TEST_PASSWORD)

  const loginResponsePromise = page.waitForResponse(
    r => r.request().method() === 'POST' && r.url().includes('/auth/login'),
    { timeout: 15000 }
  )

  await page.getByRole('button', { name: /Giriş Yap/i }).click()

  const loginResponse = await loginResponsePromise
  if (!loginResponse.ok()) {
    throw new Error(`Login başarısız: status ${loginResponse.status()} (${loginResponse.url()})`)
  }

  await expect(page).not.toHaveURL(/\/login(\?|$)/, { timeout: 15000 })
}

export async function ensureLoggedIn({ page, context, startPath = '/' }: EnsureLoggedInArgs) {
  if (TEST_ACCESS_TOKEN) {
    await context.addInitScript(token => {
      try {
        // Token bir kere seed edilsin; fallback login'den sonra tekrar yazıp bozmayalım.
        if (window.localStorage.getItem('__pw_disable_seed_token') === '1') return
        if (window.localStorage.getItem('user')) return
        window.localStorage.setItem('user', JSON.stringify({ accessToken: token, refreshToken: token }))
      } catch {
        // localStorage erişilemezse sessiz geç
      }
    }, TEST_ACCESS_TOKEN)
  }

  await page.goto(startPath, { waitUntil: 'networkidle' })
  await waitForPossibleRedirectToLogin(page)

  // Token geçerliyse /login'e düşmeyiz.
  if (!isLoginPageUrl(page.url())) return

  // Seed edilen token geçersiz; credential login öncesi tekrar seed edilmesini engelle ve temizle.
  await page.evaluate(() => {
    window.localStorage.setItem('__pw_disable_seed_token', '1')
    window.localStorage.removeItem('user')
  })

  await loginViaUi(page)

  // Fallback login sonrası hedef sayfaya gerçekten erişebildiğimizi doğrula.
  await page.goto(startPath, { waitUntil: 'networkidle' })
  await waitForPossibleRedirectToLogin(page)
  if (isLoginPageUrl(page.url())) {
    throw new Error('Login fallback başarısız: UI login sonrası hâlâ /login sayfasına yönlendirildi.')
  }
}
