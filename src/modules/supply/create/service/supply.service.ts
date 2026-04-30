import type { PaginatedResponse, PaginationOptions } from '@/types'
import { ColumnSort, SortDirection } from '@tanstack/react-table'
import type {
  CreateSupplyOrderPayload,
  CreateSupplyOrderResponse,
  ListSupplyProductsParams,
  SupplyBrand,
  SupplyCategory,
  SupplyOrderDetail,
  SupplyOrderSummary,
  SupplyPaymentInformation,
  SupplyProduct
} from '../types'
import { mockSupplyOrderDetails, mockSupplyPaymentInformation } from './mock/supply-orders.mock'
import { mockSupplyCategories, mockSupplyProducts } from './mock/supply-products.mock'

type ListBrandsParams = {
  categoryId?: string
}

class SupplyService {
  private orderDetails: SupplyOrderDetail[] = [...mockSupplyOrderDetails]

  async listProducts(
    params: ListSupplyProductsParams & { pagination: PaginationOptions }
  ): Promise<PaginatedResponse<SupplyProduct>> {
    const search = params.search?.trim()
    const q = search ? search.toLocaleLowerCase('tr-TR') : ''
    const categoryId = this.normalizeFilterValue(params.categoryId)
    const brandId = this.normalizeFilterValue(params.brandId)

    const filtered = mockSupplyProducts
      .filter(product => {
        if (
          q &&
          !product.name.toLocaleLowerCase('tr-TR').includes(q) &&
          !product.brand.name.toLocaleLowerCase('tr-TR').includes(q)
        ) {
          return false
        }

        if (categoryId && product.category.id !== categoryId) {
          return false
        }

        if (brandId && product.brand.id !== brandId) {
          return false
        }

        return true
      })
      .sort((a, b) => this.compareProducts(a, b, params.sortBy ?? 'name', params.sortDirection))

    const { page, limit } = params.pagination
    const start = (page - 1) * limit

    return {
      data: filtered.slice(start, start + limit),
      total: filtered.length
    }
  }

  async listCategories(): Promise<SupplyCategory[]> {
    return [...mockSupplyCategories]
  }

  async listBrands(params?: ListBrandsParams): Promise<SupplyBrand[]> {
    const categoryId = this.normalizeFilterValue(params?.categoryId)
    const products = categoryId
      ? mockSupplyProducts.filter(product => product.category.id === categoryId)
      : mockSupplyProducts

    const uniqueBrands = new Map<string, SupplyBrand>()

    for (const product of products) {
      uniqueBrands.set(product.brand.id, product.brand)
    }

    return [...uniqueBrands.values()].sort((a, b) => a.name.localeCompare(b.name, 'tr'))
  }

  async listMyOrders(params: { pagination: PaginationOptions }): Promise<PaginatedResponse<SupplyOrderSummary>> {
    const sorted = [...this.orderDetails].sort(
      (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    )
    const { page, limit } = params.pagination
    const start = (page - 1) * limit

    const data = sorted.slice(start, start + limit).map(order => ({
      id: order.id,
      totalAmount: order.totalAmount,
      orderDate: order.orderDate,
      isPaymentReceived: order.isPaymentReceived,
      productCount: order.productCount
    }))

    return {
      data,
      total: sorted.length
    }
  }

  async getMyOrderDetail(orderId: string): Promise<SupplyOrderDetail> {
    const order = this.orderDetails.find(item => item.id === orderId)
    if (!order) {
      throw new Error('Sipariş bulunamadı')
    }

    return { ...order, items: [...order.items] }
  }

  async getOrderPaymentInformation(orderId: string): Promise<SupplyPaymentInformation> {
    void orderId
    return { ...mockSupplyPaymentInformation }
  }

  async createOrder(payload: CreateSupplyOrderPayload): Promise<CreateSupplyOrderResponse> {
    const items = payload.items
      .map(item => {
        const product = mockSupplyProducts.find(product => product.id === item.productId)
        if (!product) return null

        return {
          productId: product.id,
          productName: product.name,
          brandName: product.brand.name,
          quantity: item.quantity,
          unitPrice: product.price,
          totalPrice: product.price * item.quantity
        }
      })
      .filter(Boolean)

    const createdOrderId = `SO-2026-${String(this.orderDetails.length + 1).padStart(3, '0')}`

    const totalAmount = items.reduce((sum, item) => sum + item!.totalPrice, 0)

    this.orderDetails = [
      {
        id: createdOrderId,
        totalAmount,
        orderDate: new Date().toISOString(),
        isPaymentReceived: false,
        productCount: items.reduce((sum, item) => sum + item!.quantity, 0),
        items: items as SupplyOrderDetail['items']
      },
      ...this.orderDetails
    ]

    return {
      orderId: createdOrderId,
      message: 'Siparişiniz başarıyla alındı. Ödeme kontrolü sonrası hazırlık başlayacaktır.'
    }
  }

  private compareProducts(
    a: SupplyProduct,
    b: SupplyProduct,
    sortBy: ColumnSort['id'],
    sortDirection?: SortDirection
  ): number {
    const base = sortBy === 'price' ? a.price - b.price : a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' })

    return sortDirection === 'desc' ? -base : base
  }

  private normalizeFilterValue(value?: string): string | undefined {
    const normalized = value?.trim()
    if (!normalized || normalized === 'all') return undefined
    return normalized
  }
}

const supplyService = new SupplyService()

export { supplyService }
