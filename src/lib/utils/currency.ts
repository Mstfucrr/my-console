export function formatCurrencyTRY(amount: number | undefined, showSymbol = true) {
  if (!amount) return '0.00 ₺'
  if (showSymbol) return `${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺`
  return `${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
}
