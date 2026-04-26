import type { SupplyProduct } from '../types'

export function getSupplyUnitPrice(product: SupplyProduct): number {
  if (!product.hasDiscount || product.discountPercent == null) {
    return product.price
  }
  return product.price * (1 - product.discountPercent / 100)
}
