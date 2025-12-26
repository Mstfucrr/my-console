import { expect, test } from '@playwright/test'

const TEST_ACCESS_TOKEN = process.env.TEST_ACCESS_TOKEN || ''

test.describe('Sipariş Oluştur - Toplam Tutar TR formatlama', () => {
  test.beforeEach(async ({ page, context }) => {
    // Eğer token varsa direkt localStorage'a kaydet ve login adımını atla
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

  test('1.231,24 olarak formatlanır ve nokta girişi olduğunda virgüle çevirir', async ({ page }) => {
    await page.goto('/orders/create')
    await page.waitForLoadState('networkidle')

    const amount = page.getByLabel('Toplam Tutar (₺)')

    // 1) Kullanıcı '1231,24' yazınca 1.231,24 olarak otomatik formatlanmalı
    await amount.clear()
    await amount.type('1231,24')
    await expect(amount).toHaveValue('1.231,24')

    // 2) Kullanıcı . tuşlarsa noktayı virgüle çevirmeli
    await amount.clear()
    await amount.type('1231.24') // . karakteri virgüle çevrilmeli
    await expect(amount).toHaveValue('1.231,24')

    // 3) Nokta basıldıktan sonra Türkçe formatta virgüle dönüşüyor mu
    await amount.clear()
    await amount.type('1000')
    await amount.press('End')
    await amount.type('.')
    await expect(amount).toHaveValue('1.000,') // Kullanıcı . basınca virgül oluşur

    // Bir ondalık sayı girişi
    await amount.type('50')
    await expect(amount).toHaveValue('1.000,50')

    // 4) Çoklu nokta veya çoklu virgül girişinde, fazlasını yine doğru formata çevirmeli
    await amount.clear()
    await amount.type('999,9999')
    await expect(amount).toHaveValue('999,99') // Sadece ilk iki ondalık hane kalmalı

    // 5) Büyük tutarda, binlik ayraçlar doğru mu?
    await amount.clear()
    await amount.type('1000000,57')
    await expect(amount).toHaveValue('1.000.000,57')

    // 6) Yalnızca virgül yazılırsa bunu olduğu gibi bırakmalı
    await amount.clear()
    await amount.type('12,')
    await expect(amount).toHaveValue('12,')

    // 7) Soldan sıfırları sildirme kontrolü
    await amount.clear()
    await amount.type('0001234,56')
    await expect(amount).toHaveValue('1.234,56')
  })

  test('Boş bırakıldığında validasyon hatası gösterir', async ({ page }) => {
    await page.goto('/orders/create')

    // Formu gönder
    await page.getByRole('button', { name: 'Siparişi Oluştur' }).click()

    // "Toplam tutar zorunludur" mesajı (FormMessage)
    await expect(page.getByText('Toplam tutar zorunludur')).toBeVisible()
  })
})
