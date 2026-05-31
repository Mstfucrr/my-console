import { privateAxiosInstance } from '@/lib/axios'
import { SaveBusinessInfoRequest, BusinessInfoDocType } from '../types'

class BusinessInfoService {
  async saveBusinessInfo(businessInfo: SaveBusinessInfoRequest): Promise<void> {
    const { data } = await privateAxiosInstance.post<{ success: boolean }>(
      '/merchant/store/financial-details',
      businessInfo
    )
    if (!data.success) {
      throw new Error('İşletme bilgileriniz kaydedilirken bir hata oluştu')
    }
  }

  async uploadDocument(file: File, docType: BusinessInfoDocType): Promise<string> {
    const fd = new FormData()
    fd.append('file', file)
    const { data } = await privateAxiosInstance.post<{ key: string; url?: string }>(`/merchant/store/upload`, fd, {
      params: { docType },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return data.key
  }
}

const businessInfoService = new BusinessInfoService()

export { businessInfoService }
