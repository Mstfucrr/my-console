import { defineConfig, devices } from '@playwright/test'

/**
 * Ortam değişkenlerini dosyadan oku.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '.env.test') })

/**
 * https://playwright.dev/docs/test-configuration adresine bakınız.
 */
export default defineConfig({
  testDir: './tests',
  /* Test dosyalarındaki testleri paralel olarak çalıştır */
  fullyParallel: true,
  /* Kaynak kodda yanlışlıkla test.only bırakırsan CI'da derlemeyi başarısız yap. */
  forbidOnly: !!process.env.CI,
  /* Yalnızca CI ortamında tekrar deneme (retry) ayarla */
  retries: process.env.CI ? 2 : 0,
  /* CI'da paralel testleri devre dışı bırak. */
  workers: process.env.CI ? 1 : undefined,
  /* Kullanılacak raporlayıcıyı ayarla. Bkz: https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Aşağıdaki tüm projeler için ortak ayarlar. Bkz: https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* İşlemlerde kullanılacak Base URL. Örn: await page.goto('') */
    baseURL: 'http://localhost:3000',

    /* Test başarısız olduktan sonra yeniden denenirken trace toplar. Bkz: https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Hata durumunda ekran görüntüsü alır */
    screenshot: 'only-on-failure',
    /* Hata durumunda video kaydeder */
    video: 'retain-on-failure'
  },

  /* Temel tarayıcılar için projeleri yapılandır */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] }
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] }
    // }

    /* Mobil görünümde test etmek için kullanılır. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Markalı tarayıcılara karşı test etmek için kullanılır. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' }
    // }
  ],

  /* Testler başlamadan önce yerel geliştirme sunucunuzu başlatın */
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
})
