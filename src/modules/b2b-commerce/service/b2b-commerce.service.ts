import { privateAxiosInstance } from '@/lib/axios'
import type { PaginatedResponse, PaginationOptions } from '@/types'
import type {
  CreateB2BOrderPayload,
  CreateB2BOrderResponse,
  ListB2BProductsParams,
  B2BBrand,
  B2BCategory,
  B2BOrderDetail,
  B2BOrderSummary,
  B2BPaymentInformation,
  B2BProduct
} from '../types'
import { parseB2BFilterSelection } from '../utils/b2b-filter-selection'

type ListBrandsParams = {
  categoryId?: string | string[]
}

type ListCategoriesParams = {
  brandId?: string | string[]
}

function toCsvQueryParam(value?: string | string[]): string | undefined {
  const ids = parseB2BFilterSelection(value)
  if (ids.length === 0) return undefined
  return ids.join(',')
}

class B2BCommerceService {
  async listProducts(
    params: ListB2BProductsParams & { pagination: PaginationOptions }
  ): Promise<PaginatedResponse<B2BProduct>> {
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

    const { data } = await privateAxiosInstance.get<{ data: B2BProduct[]; total: number }>('/commerce/products', {
      params: query
    })

    return {
      data: data.data,
      total: data.total
    }
  }

  async listCategories(params?: ListCategoriesParams): Promise<B2BCategory[]> {
    const brandId = toCsvQueryParam(params?.brandId)
    const query = brandId !== undefined ? { brandId } : undefined

    const { data } = await privateAxiosInstance.get<B2BCategory[]>('/commerce/categories', { params: query })
    return data
  }

  async listBrands(params?: ListBrandsParams): Promise<B2BBrand[]> {
    const categoryId = toCsvQueryParam(params?.categoryId)
    const query = categoryId !== undefined ? { categoryId } : undefined

    const { data } = await privateAxiosInstance.get<B2BBrand[]>('/commerce/brands', { params: query })
    return data
  }

  async listOrders(params: { pagination: PaginationOptions }): Promise<PaginatedResponse<B2BOrderSummary>> {
    const { page, limit } = params.pagination
    const { data } = await privateAxiosInstance.get<{ data: B2BOrderSummary[]; total: number }>('/commerce/orders', {
      params: { page, limit }
    })

    return {
      data: data.data,
      total: data.total
    }
  }

  async getOrderDetail(orderId: string): Promise<B2BOrderDetail> {
    const { data } = await privateAxiosInstance.get<B2BOrderDetail>(`/commerce/order/${orderId}`)
    return data
  }

  async getPaymentInformation(): Promise<B2BPaymentInformation> {
    const { data } = await privateAxiosInstance.get<B2BPaymentInformation>('/commerce/paymentInfo')
    return data
  }

  async createOrder(payload: CreateB2BOrderPayload): Promise<CreateB2BOrderResponse> {
    const { data } = await privateAxiosInstance.post<CreateB2BOrderResponse>('/commerce/create', payload)
    return data
  }
}

const b2bCommerceService = new B2BCommerceService()

export { b2bCommerceService }
