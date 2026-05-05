import { ColumnSort, SortDirection } from '@tanstack/react-table'

export interface SupplyTag {
  id: string
  name: string
  /** Kategori/marka listelerinde; seçili filtreye göre BE dönebilir */
  productCount?: number
}

export type SupplyCategory = SupplyTag

export type SupplyBrand = SupplyTag

export interface SupplyProduct {
  id: string
  name: string
  brand: SupplyBrand
  category: SupplyCategory
  quantityPerBox: number
  boxWeight: string
  unit: string
  price: number
  hasDiscount?: boolean
  discountPercent?: number
  freeShipping?: boolean
  image?: string
}

export interface SupplyCartItem {
  product: SupplyProduct
  quantity: number
}

export interface ListSupplyProductsParams {
  search?: string
  categoryId?: string | string[]
  brandId?: string | string[]
  sortBy?: ColumnSort['id']
  sortDirection?: SortDirection
}

export interface SupplyOrderSummary {
  id: string
  totalAmount: number
  orderDate: string
  isPaymentReceived: boolean
  productCount: number
}

export interface SupplyOrderItem {
  productId: string
  productName: string
  brandName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface SupplyOrderDetail extends SupplyOrderSummary {
  items: SupplyOrderItem[]
}

export interface SupplyPaymentInformation {
  iban: string
  accountName: string
  description: string
}

export interface CreateSupplyOrderPayload {
  items: Array<{
    productId: string
    quantity: number
  }>
}

export interface CreateSupplyOrderResponse {
  orderId: string
  message: string
}
