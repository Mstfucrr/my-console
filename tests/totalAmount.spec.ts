import { expect, test } from '@playwright/test'

const TEST_ACCESS_TOKEN = process.env.TEST_ACCESS_TOKEN || ''

test.describe('Create Order - Total Amount TR formatting', () => {
  test.beforeEach(async ({ page, context }) => {
    // Eğer token varsa direkt localStorage'a set et ve login adımını atla
    if (TEST_ACCESS_TOKEN) {
      await context.addInitScript(token => {
        window.localStorage.setItem(
          'user',
          JSON.stringify({
            accessToken: token,
            refreshToken: token
          })
        )
      }, TEST_ACCESS_TOKEN)

      // Direkt ana sayfaya git (login kontrolü geçilecek)
      await page.goto('/')
      // Sayfanın yüklendiğini bekle
      await page.waitForLoadState('networkidle')
    }
  })
  test('formats as 1.231,24 and blocks dot input', async ({ page }) => {
    // Bu URL’yi senin route’una göre güncelle
    await page.goto('/orders/create')

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    const amount = page.getByLabel('Toplam Tutar (₺)')

    // 1) Düz sayıyı ve virgüllü kısmı yaz
    await amount.fill('1231,24')
    await expect(amount).toHaveValue('1.231,24')

    // 2) Nokta engelleniyor mu? (kullanıcı . basarsa değer bozulmamalı)
    await amount.press('End')
    await amount.type('.')
    await expect(amount).toHaveValue('1.231,24') // değişmemeli

    // 3) 2 haneden fazla ondalık kesiliyor mu?
    await amount.fill('999,9999')
    await expect(amount).toHaveValue('999,99')

    // 4) Binlik otomatik koyuyor mu?
    await amount.fill('1000000,5')
    await expect(amount).toHaveValue('1.000.000,5') // 1 hane kalabilir; istersen 50 yazdırmak için farklı kural gerekir

    // 5) İstersen: sadece virgül yazıp devam edebiliyor mu?
    await amount.fill('12,')
    await expect(amount).toHaveValue('12,')
  })

  test('shows validation error when empty', async ({ page }) => {
    await page.goto('/orders/create')

    // Submit
    await page.getByRole('button', { name: 'Siparişi Oluştur' }).click()

    // Total amount zorunlu mesajı (FormMessage)
    await expect(page.getByText('Toplam tutar zorunludur')).toBeVisible()
  })
})
