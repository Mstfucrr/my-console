import type { Page } from '@playwright/test'
import type { IProfileFinancialDetails, IProfileResponse } from '@/types/profile'

/** Playwright tenant kullanıcıları için /auth/profile yanıtı (ProfileGuard + welcome yönlendirmesi) */
export function buildTenantProfile(financialDetails: IProfileFinancialDetails | null): IProfileResponse {
  return {
    userId: 'playwright-tenant-user',
    accountId: '',
    email: 'tenant-playwright@test.local',
    restaurantId: '',
    omsRestaurantId: '',
    accountType: 'tenant',
    data: {
      merchantId: 'playwright-merchant',
      taxNumber: '1234567890',
      firstName: 'Playwright',
      surname: 'Tenant',
      email: 'tenant-playwright@test.local',
      phoneNumber: '5320000000',
      status: 'ACTIVE',
      updatedAt: new Date().toISOString(),
      financialDetails
    }
  }
}

/** Finans onboarding tamamlanmış tenant: /applications ve /applications/new erişilebilir */
export async function mockTenantProfileWithCompletedFinance(page: Page) {
  const body = buildTenantProfile({
    companyType: 'Kurumsal',
    companyName: 'Mock Şirket AŞ',
    taxOffice: 'Kadıköy',
    iban: 'TR330006100519786457841326',
    tckn: null,
    taxDocumentUrl: 'https://example.com/tax',
    signatureCircularUrl: 'https://example.com/sig',
    idFrontUrl: 'https://example.com/idf',
    idBackUrl: 'https://example.com/idb'
  })

  await page.route('**/auth/profile', async route => {
    if (route.request().method() !== 'GET') {
      await route.fallback()
      return
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body)
    })
  })
}
