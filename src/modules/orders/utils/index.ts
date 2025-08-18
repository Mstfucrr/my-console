function formatCurrencyTRY(amount: number) {
  return `${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺`
}

function formatDateTR(dateString: string) {
  return new Date(dateString).toLocaleString('tr-TR')
}

export { formatCurrencyTRY, formatDateTR }
