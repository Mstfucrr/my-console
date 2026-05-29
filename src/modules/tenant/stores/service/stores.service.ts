// import { privateAxiosInstance } from '@/lib/axios'
import { privateAxiosInstance } from '@/lib/axios'
import { PaginatedResponse, PaginationOptions } from '@/types'
import type { ColumnSort } from '@tanstack/react-table'
import { appendMerchantStoreFilterParams } from '../../shared/merchant-store-list-filters'
import type { StoresFilterProperties } from '../components/stores-filters'
import { STORE_STATUS_OPTIONS } from '../constants'
import type { StoreDetailRecord, StoreListRecord } from '../types'

export type StoreStatusItem = { code: number; value: string }

class StoresService {
  async getStores(
    filters?: StoresFilterProperties,
    pagination?: PaginationOptions,
    sort?: ColumnSort
  ): Promise<PaginatedResponse<StoreListRecord>> {
    const params: Record<string, string | number | string[] | undefined> = {
      page: pagination?.page,
      limit: pagination?.limit
    }
    if (sort?.id) {
      params.sortBy = sort.id
      params.sortDirection = sort.desc ? 'DESC' : 'ASC'
    }
    const filterEntries: Array<{ column: 'restaurantName' | 'city'; value: string }> = []
    if (filters?.search?.trim()) {
      params.search = filters.search.trim()
    }
    const city = filters?.city?.trim()
    if (city && city !== 'all') {
      filterEntries.push({ column: 'city', value: city })
    }
    appendMerchantStoreFilterParams(params, filterEntries)

    const { data } = await privateAxiosInstance.get<PaginatedResponse<StoreListRecord>>('/merchant/store/restaurants', {
      params
    })
    return data
  }

  async getStore(storeId: string): Promise<StoreDetailRecord> {
    const { data } = await privateAxiosInstance.get<StoreDetailRecord>(
      `/merchant/store/restaurants/${storeId}/application`
    )
    return data
  }

  getStoresStatuses(): readonly StoreStatusItem[] {
    return STORE_STATUS_OPTIONS
  }
}

const storesService = new StoresService()
export { storesService }
