import { expect, storeTest as test } from '../playwright/fixtures/authenticated'

test.describe('Sipariş Oluştur - Toplam Tutar TR formatlama', () => {
  test('1.231,24 olarak formatlanır ve nokta girişi olduğunda virgüle çevirir', async ({ page }) => {
    await page.goto('/orders/create')
    await page.waitForLoadState('networkidle')

    const amount = page.getByLabel('Toplam Tutar (₺)')

    // 1) Kullanıcı '1231,24' yazınca 1.231,24 olarak otomatik formatlanmalı
    await amount.fill('1231,24')
    await expect(amount).toHaveValue('1.231,24')

    // 2) Nokta basıldıktan sonra Türkçe formatta virgüle dönüşüyor mu
    await amount.fill('1000')
    await amount.press('End')
    await amount.press('.') // . yerine comma kurallı dönüşüm için
    await expect(amount).toHaveValue('1.000,') // Kullanıcı . basınca virgül oluşur

    // Hatalı adım: Klavyeyle arka arkaya rakam girmek yerine değeri topluca doldur
    await amount.fill('1000,50')
    await expect(amount).toHaveValue('1.000,50')

    // 3) Çoklu nokta veya çoklu virgül girişinde, fazlasını yine doğru formata çevirmeli
    await amount.fill('999,9999')
    await expect(amount).toHaveValue('999,99') // Sadece ilk iki ondalık hane kalmalı

    // 4) Üst limit (99.999,99) üstü girişler kabul edilmemeli (regexPattern testini geçmez)
    await amount.fill('99999,57')
    await expect(amount).toHaveValue('99.999,57')

    // 5) 100.000,00 ve üstü kabul edilmez; önceki değer korunur
    await amount.fill('100000,57')
    await expect(amount).toHaveValue('99.999,57')

    // 6) Yalnızca virgül yazılırsa bunu olduğu gibi bırakmalı
    await amount.fill('12,')
    await expect(amount).toHaveValue('12,')

    // 7) Soldan sıfırları sildirme kontrolü
    await amount.fill('0001234,56')
    await expect(amount).toHaveValue('1.234,56')
  })

  test('Boş bırakıldığında validasyon hatası gösterir', async ({ page }) => {
    await page.goto('/orders/create')
    await page.waitForLoadState('networkidle')

    // Formu gönder
    await page.getByTestId('create-order-submit-button').click()

    // "Toplam tutar zorunludur" mesajı (FormMessage)
    await expect(page.getByText('Toplam tutar zorunludur')).toBeVisible()
  })
})
