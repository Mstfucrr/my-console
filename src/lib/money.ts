export function toCents(amount: number | string): number {
  // `Math.round(amount * 100)` JS float hassasiyeti yüzünden bazen 1 kuruş kaçırabilir.
  // Örn: 594.8 * 100 => 59479.99999999999
  // EPSILON ekleyip yuvarlayarak tam kuruşa sabitleriz.
  if (typeof amount === 'string') amount = amount.replaceAll('.', '').replace(/,/g, '.')
  return Math.round((Number(amount) + Number.EPSILON) * 100)
}
