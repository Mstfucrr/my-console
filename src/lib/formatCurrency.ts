export const formatCurrency = (amount: number, showSymbol = true) => {
  if (showSymbol)
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)

  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2
  })
    .format(amount)
    .replace('₺', '')
}
