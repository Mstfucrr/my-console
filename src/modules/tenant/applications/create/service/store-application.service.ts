import { privateAxiosInstance } from '@/lib/axios'
import type {
  CreateStoreApplicationPayload,
  CreateStoreApplicationResponse,
  GetSectorsResponse,
  SectorOption
} from './store-application.service.type'

/** partner-api dokümanı — gateway base URL ile uyumlu olmalı */
const STORE_APPLICATIONS_BASE = '/merchant/store'

class StoreApplicationService {
  async getSectors(): Promise<SectorOption[]> {
    const { data } = await privateAxiosInstance.get<GetSectorsResponse>(`${STORE_APPLICATIONS_BASE}/sectors`)
    return data.data ?? []
  }

  async createApplication(payload: CreateStoreApplicationPayload): Promise<CreateStoreApplicationResponse> {
    const { data } = await privateAxiosInstance.post<CreateStoreApplicationResponse>(
      `${STORE_APPLICATIONS_BASE}/applications`,
      payload
    )
    return data
  }
}

const storeApplicationService = new StoreApplicationService()
export { storeApplicationService }
