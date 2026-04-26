export interface SupplyTag {
  id: string
  name: string
}

export interface SupplyProduct {
  id: string
  name: string
  brand: SupplyTag
  category: SupplyTag | null
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
}
