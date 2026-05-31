import type { B2BProduct } from '../types'

export function getB2BUnitPrice(product: B2BProduct): number {
  if (!product.hasDiscount || product.discountPercent == null) {
    return product.price
  }
  return product.price * (1 - product.discountPercent / 100)
}
