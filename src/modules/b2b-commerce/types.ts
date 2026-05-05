import { ColumnSort, SortDirection } from '@tanstack/react-table'

export interface B2BTag {
  id: string
  name: string
  /** Kategori/marka listelerinde; seçili filtreye göre BE dönebilir */
  productCount?: number
}

export type B2BCategory = B2BTag

export type B2BBrand = B2BTag

export interface B2BProduct {
  id: string
  name: string
  brand: B2BBrand
  category: B2BCategory
  quantityPerBox: number
  boxWeight: string
  unit: string
  price: number
  hasDiscount?: boolean
  discountPercent?: number
  freeShipping?: boolean
  image?: string
}

export interface B2BCartItem {
  product: B2BProduct
  quantity: number
}

export interface ListB2BProductsParams {
  search?: string
  categoryId?: string | string[]
  brandId?: string | string[]
  sortBy?: ColumnSort['id']
  sortDirection?: SortDirection
}

export interface B2BOrderSummary {
  id: string
  totalAmount: number
  orderDate: string
  isPaymentReceived: boolean
  productCount: number
}

export interface B2BOrderItem {
  productId: string
  productName: string
  brandName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface B2BOrderDetail extends B2BOrderSummary {
  items: B2BOrderItem[]
}

export interface B2BPaymentInformation {
  iban: string
  accountName: string
  description: string
}

export interface CreateB2BOrderPayload {
  items: Array<{
    productId: string
    quantity: number
  }>
}

export interface CreateB2BOrderResponse {
  orderId: string
  message: string
}
