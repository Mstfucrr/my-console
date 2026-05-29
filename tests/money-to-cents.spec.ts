import { expect, test } from '@playwright/test'

import { toCents } from '@/lib/money'

const cases: Array<{ input: number | string; expected: number }> = [
  // Basit örnekler
  { input: 594.8, expected: 59480 },
  { input: 150.5, expected: 15050 },
  { input: '12.', expected: 1200 },
  { input: 0.1, expected: 10 },
  { input: 0.29, expected: 29 },
  { input: '12,34', expected: 1234 },

  // Float edge-case'ler
  { input: 1.005, expected: 101 }, // 1.005 * 100 => 100.49999...
  { input: 2.675, expected: 268 }, // klasik float örneği
  { input: 0.30000000000000004, expected: 30 },

  // Büyük tutar
  { input: 9_999_999.99, expected: 999_999_999 },
  { input: '1.222.345,67', expected: 122234567 },
  { input: '9.999.999,99', expected: 999_999_999 }
]
test.describe('toCents()', () => {
  test('farklı varyasyonları doğru kuruşa çevirir', () => {
    for (const { input, expected } of cases) {
      const cents = toCents(input)
      expect(cents).toBe(expected)
      expect(Number.isInteger(cents)).toBeTruthy()
    }
  })
})
