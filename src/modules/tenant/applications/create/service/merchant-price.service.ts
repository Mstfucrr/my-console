import { privateAxiosInstance } from '@/lib/axios'

export type EstimatedPackageUnitPriceParams = {
  cityId: string
  countyId: string
  vkn: string
}

export interface MerchantPriceResolveResult {
  found: boolean
  resolvedBy?: string
  minPrice?: number
  maxPrice?: number
  message?: string
}

/** GET /merchant-prices/resolve — bölgeye göre tahmini paket başı fiyat */
class MerchantPriceService {
  async getEstimatedPackageUnitPrice(params: EstimatedPackageUnitPriceParams): Promise<string | null> {
    const { data } = await privateAxiosInstance.get<MerchantPriceResolveResult>('/merchant-prices/resolve', {
      params
    })
    if (!data.found) return null
    return `${data.minPrice} - ${data.maxPrice}`
  }
}

const merchantPriceService = new MerchantPriceService()
export { merchantPriceService }
