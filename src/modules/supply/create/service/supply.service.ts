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
import { parseSupplyFilterSelection } from '../utils/supply-filter-selection'
import { mockSupplyOrderDetails, mockSupplyPaymentInformation } from './mock/supply-orders.mock'
import { mockSupplyCategories, mockSupplyProducts } from './mock/supply-products.mock'

type ListBrandsParams = {
  categoryId?: string | string[]
}

type ListCategoriesParams = {
  brandId?: string | string[]
}

class SupplyService {
  private orderDetails: SupplyOrderDetail[] = [...mockSupplyOrderDetails]

  async listProducts(
    params: ListSupplyProductsParams & { pagination: PaginationOptions }
  ): Promise<PaginatedResponse<SupplyProduct>> {
    const search = params.search?.trim()
    const q = search ? search.toLocaleLowerCase('tr-TR') : ''
    const categoryIds = this.toFilterIdSet(params.categoryId)
    const brandIds = this.toFilterIdSet(params.brandId)

    const filtered = mockSupplyProducts
      .filter(product => {
        if (
          q &&
          !product.name.toLocaleLowerCase('tr-TR').includes(q) &&
          !product.brand.name.toLocaleLowerCase('tr-TR').includes(q)
        ) {
          return false
        }

        if (categoryIds && !categoryIds.has(product.category.id)) {
          return false
        }

        if (brandIds && !brandIds.has(product.brand.id)) {
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

  async listCategories(params?: ListCategoriesParams): Promise<SupplyCategory[]> {
    const brandIds = this.toFilterIdSet(params?.brandId)
    const products = brandIds
      ? mockSupplyProducts.filter(product => brandIds.has(product.brand.id))
      : mockSupplyProducts

    const productCountByCategoryId = products.reduce<Record<string, number>>((acc, product) => {
      acc[product.category.id] = (acc[product.category.id] ?? 0) + 1
      return acc
    }, {})

    return mockSupplyCategories.map(category => ({
      ...category,
      productCount: productCountByCategoryId[category.id] ?? 0
    }))
  }

  async listBrands(params?: ListBrandsParams): Promise<SupplyBrand[]> {
    const categoryIds = this.toFilterIdSet(params?.categoryId)
    const products = categoryIds
      ? mockSupplyProducts.filter(product => categoryIds.has(product.category.id))
      : mockSupplyProducts

    const brandCounts = new Map<string, number>()
    const uniqueBrands = new Map<string, SupplyBrand>()

    for (const product of products) {
      uniqueBrands.set(product.brand.id, product.brand)
      brandCounts.set(product.brand.id, (brandCounts.get(product.brand.id) ?? 0) + 1)
    }

    return [...uniqueBrands.values()]
      .map(brand => ({
        ...brand,
        productCount: brandCounts.get(brand.id) ?? 0
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
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

  private toFilterIdSet(value?: string | string[]): Set<string> | undefined {
    const ids = parseSupplyFilterSelection(value)
    if (ids.length === 0) return undefined
    return new Set(ids)
  }
}

const supplyService = new SupplyService()

export { supplyService }
