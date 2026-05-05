import { privateAxiosInstance } from '@/lib/axios'
import type { PaginatedResponse, PaginationOptions } from '@/types'
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

type ListBrandsParams = {
  categoryId?: string | string[]
}

type ListCategoriesParams = {
  brandId?: string | string[]
}

function toCsvQueryParam(value?: string | string[]): string | undefined {
  const ids = parseSupplyFilterSelection(value)
  if (ids.length === 0) return undefined
  return ids.join(',')
}

class SupplyService {
  async listProducts(
    params: ListSupplyProductsParams & { pagination: PaginationOptions }
  ): Promise<PaginatedResponse<SupplyProduct>> {
    const { page, limit } = params.pagination
    const search = params.search?.trim()

    const query: Record<string, string | number | undefined> = {
      page,
      limit
    }

    if (search) query.search = search

    const categoryId = toCsvQueryParam(params.categoryId)
    const brandId = toCsvQueryParam(params.brandId)
    if (categoryId !== undefined) query.categoryId = categoryId
    if (brandId !== undefined) query.brandId = brandId

    if (params.sortBy) query.sortBy = params.sortBy as string
    if (params.sortDirection) query.sortDirection = params.sortDirection as string

    const { data } = await privateAxiosInstance.get<{ data: SupplyProduct[]; total: number }>('/commerce/products', {
      params: query
    })

    return {
      data: data.data,
      total: data.total
    }
  }

  async listCategories(params?: ListCategoriesParams): Promise<SupplyCategory[]> {
    const brandId = toCsvQueryParam(params?.brandId)
    const query = brandId !== undefined ? { brandId } : undefined

    const { data } = await privateAxiosInstance.get<SupplyCategory[]>('/commerce/categories', { params: query })
    return data
  }

  async listBrands(params?: ListBrandsParams): Promise<SupplyBrand[]> {
    const categoryId = toCsvQueryParam(params?.categoryId)
    const query = categoryId !== undefined ? { categoryId } : undefined

    const { data } = await privateAxiosInstance.get<SupplyBrand[]>('/commerce/brands', { params: query })
    return data
  }

  async listMyOrders(params: { pagination: PaginationOptions }): Promise<PaginatedResponse<SupplyOrderSummary>> {
    const { page, limit } = params.pagination
    const { data } = await privateAxiosInstance.get<{ data: SupplyOrderSummary[]; total: number }>('/commerce/orders', {
      params: { page, limit }
    })

    return {
      data: data.data,
      total: data.total
    }
  }

  async getMyOrderDetail(orderId: string): Promise<SupplyOrderDetail> {
    const { data } = await privateAxiosInstance.get<SupplyOrderDetail>(`/commerce/order/${orderId}`)
    return data
  }

  async getPaymentInformation(): Promise<SupplyPaymentInformation> {
    const { data } = await privateAxiosInstance.get<SupplyPaymentInformation>('/commerce/paymentInfo')
    return data
  }

  async createOrder(payload: CreateSupplyOrderPayload): Promise<CreateSupplyOrderResponse> {
    const { data } = await privateAxiosInstance.post<CreateSupplyOrderResponse>('/commerce/create', payload)
    return data
  }
}

const supplyService = new SupplyService()

export { supplyService }
