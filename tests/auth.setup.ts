import { expect, test as setup } from '@playwright/test'
import path from 'path'

const authFile = path.join(__dirname, '../playwright/.auth/user.json')
const TEST_ACCOUNT_ID = process.env.TEST_ACCOUNT_ID || ''
const TEST_IDENTIFIER = process.env.TEST_IDENTIFIER || ''
const TEST_PASSWORD = process.env.TEST_PASSWORD || ''

setup('authenticate', async ({ page }) => {
  if (!TEST_ACCOUNT_ID || !TEST_IDENTIFIER || !TEST_PASSWORD) {
    throw new Error('TEST_ACCOUNT_ID, TEST_IDENTIFIER ve TEST_PASSWORD .env.test içinde tanımlı olmalı')
  }

  await page.goto('/login')
  await page.getByPlaceholder('Hesap ID giriniz').fill(TEST_ACCOUNT_ID)
  await page.getByPlaceholder('E-posta giriniz').fill(TEST_IDENTIFIER)
  await page.getByPlaceholder('Şifrenizi giriniz').fill(TEST_PASSWORD)
  await page.getByRole('button', { name: /Giriş Yap/i }).click()
  await page.waitForURL(url => url.pathname === '/', { timeout: 15000 })
  await expect
    .poll(async () => {
      return page.evaluate(() => Boolean(localStorage.getItem('user')))
    })
    .toBeTruthy()

  await page.context().storageState({ path: authFile })
})
