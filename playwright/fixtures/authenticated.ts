import { test as base, expect, type Browser, type Page, type WorkerInfo } from '@playwright/test'
import fs from 'fs'
import path from 'path'

type Role = 'store' | 'tenant'

type WorkerFixtures = {
  workerStorageState: string
}

type Credentials = {
  identifier: string
  password: string
  accountId?: string
}

const BASE_URL = 'http://localhost:3000'

function getCredentials(role: Role): Credentials {
  if (role === 'tenant') {
    return {
      identifier: process.env.TEST_TENANT_IDENTIFIER || '',
      password: process.env.TEST_TENANT_PASSWORD || ''
    }
  }

  return {
    accountId: process.env.TEST_ACCOUNT_ID || '',
    identifier: process.env.TEST_IDENTIFIER || '',
    password: process.env.TEST_PASSWORD || ''
  }
}

async function loginAsRole(page: Page, role: Role) {
  const credentials = getCredentials(role)

  if (!credentials.identifier || !credentials.password || (role === 'store' && !credentials.accountId)) {
    throw new Error(
      role === 'tenant'
        ? 'TEST_TENANT_IDENTIFIER ve TEST_TENANT_PASSWORD .env.test içinde tanımlı olmalı'
        : 'TEST_ACCOUNT_ID, TEST_IDENTIFIER ve TEST_PASSWORD .env.test içinde tanımlı olmalı'
    )
  }

  await page.goto(`${BASE_URL}/login`)

  if (role === 'tenant') {
    await page.getByTestId(`login-form-account-type-button-tenant`).click()
  } else {
    await page.getByTestId(`login-form-account-type-button-store`).click()
    const accountIdInput = page.getByPlaceholder('Hesap ID')
    await expect(accountIdInput).toBeVisible()
    await accountIdInput.fill(credentials.accountId || '')
  }

  await page.getByPlaceholder('E-posta').fill(credentials.identifier)
  await page.getByPlaceholder('Şifre').fill(credentials.password)
  await page.getByRole('button', { name: /Giriş Yap/i }).click()

  await expect
    .poll(
      async () => {
        return page.evaluate(() => Boolean(localStorage.getItem('user')))
      },
      { timeout: 20000 }
    )
    .toBeTruthy()

  await page.waitForURL(url => url.pathname !== '/login', { timeout: 15000 })
}

async function ensureStorageState(browser: Browser, role: Role, workerInfo: WorkerInfo) {
  const fileName = path.resolve(workerInfo.project.outputDir, `.auth/${role}-${workerInfo.workerIndex}.json`)

  if (!fs.existsSync(fileName)) {
    fs.mkdirSync(path.dirname(fileName), { recursive: true })
    const page = await browser.newPage({ storageState: undefined })
    await loginAsRole(page, role)
    await page.context().storageState({ path: fileName })
    await page.close()
  }

  return fileName
}

function createAuthenticatedTest(role: Role) {
  return base.extend<object, WorkerFixtures>({
    // eslint-disable-next-line react-hooks/rules-of-hooks
    storageState: ({ workerStorageState }, use) => use(workerStorageState),
    workerStorageState: [
      async ({ browser }, use, workerInfo) => {
        const fileName = await ensureStorageState(browser, role, workerInfo)
        await use(fileName)
      },
      { scope: 'worker' }
    ]
  })
}

export * from '@playwright/test'
export const storeTest = createAuthenticatedTest('store')
export const tenantTest = createAuthenticatedTest('tenant')
