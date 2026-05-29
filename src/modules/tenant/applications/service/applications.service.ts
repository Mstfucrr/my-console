// import { privateAxiosInstance } from '@/lib/axios'
import { privateAxiosInstance } from '@/lib/axios'
import { PaginatedResponse, PaginationOptions } from '@/types'
import type { ColumnSort } from '@tanstack/react-table'
import {
  appendMerchantStoreFilterParams,
  MerchantStoreListFilterColumn
} from '../../shared/merchant-store-list-filters'
import type { StoreApplicationsFilterProperties } from '../components/applications-filters'
import type { StoreApplicationDetailRecord, StoreApplicationRecord } from '../types'

export type StoreApplicationStatusItem = { code: number; value: string }

class StoreApplicationsService {
  async fetchStoreApplicationStatuses(): Promise<Array<StoreApplicationStatusItem>> {
    const { data } = await privateAxiosInstance.get<{ data: Array<StoreApplicationStatusItem> }>(
      '/merchant/store/application-statuses'
    )
    return data?.data ?? []
  }

  async getStoreApplications(
    filters?: StoreApplicationsFilterProperties,
    pagination?: PaginationOptions,
    sort?: ColumnSort
  ): Promise<PaginatedResponse<StoreApplicationRecord>> {
    const params: Record<string, string | number | string[] | undefined> = {
      page: pagination?.page,
      limit: pagination?.limit
    }
    if (sort?.id) {
      params.sortBy = sort.id
      params.sortDirection = sort.desc ? 'DESC' : 'ASC'
    }
    const filterEntries: Array<{ column: MerchantStoreListFilterColumn; value: string }> = []
    const status = filters?.status?.trim()
    if (status && status !== 'all') {
      filterEntries.push({ column: 'status', value: status })
    }

    if (filters?.search?.trim()) {
      params.search = filters.search.trim()
    }

    const city = filters?.city?.trim()
    if (city && city !== 'all') {
      filterEntries.push({ column: 'city', value: city })
    }
    appendMerchantStoreFilterParams(params, filterEntries)

    const { data } = await privateAxiosInstance.get<PaginatedResponse<StoreApplicationRecord>>(
      '/merchant/store/applications',
      { params }
    )
    return data
  }

  async getStoreApplication(id: string): Promise<StoreApplicationDetailRecord> {
    const { data } = await privateAxiosInstance.get<StoreApplicationDetailRecord>(`/merchant/store/applications/${id}`)
    return data
  }
}

const storeApplicationsService = new StoreApplicationsService()
export { storeApplicationsService }
