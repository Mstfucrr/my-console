import type { PaginatedResponse, PaginationOptions } from '@/types'
import type { ListSupplyProductsParams, SupplyProduct } from '../types'
import { mockSupplyProducts } from './mock/supply-products.mock'

class SupplyService {
  async listProducts(
    params: ListSupplyProductsParams & { pagination: PaginationOptions }
  ): Promise<PaginatedResponse<SupplyProduct>> {
    const q = (params.search ?? '').trim().toLowerCase()
    const filtered = mockSupplyProducts.filter(product => {
      if (!q) return true
      return product.name.toLowerCase().includes(q) || product.brand.name.toLowerCase().includes(q)
    })

    const { page, limit } = params.pagination
    const start = (page - 1) * limit
    const data = filtered.slice(start, start + limit)

    return {
      data,
      total: filtered.length
    }
  }
}

const supplyService = new SupplyService()

export { supplyService }
