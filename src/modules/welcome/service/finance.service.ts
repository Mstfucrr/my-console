import { privateAxiosInstance } from '@/lib/axios'
import { SaveFinancialDetailsRequest, WelcomeDocType } from '../types'

class FinanceService {
  async createFinance(finance: SaveFinancialDetailsRequest): Promise<void> {
    const { data } = await privateAxiosInstance.post<{ success: boolean }>('/merchant/store/financial-details', finance)
    if (!data.success) {
      throw new Error('İşletme bilgileriniz kaydedilirken bir hata oluştu')
    }
  }

  async uploadDocument(file: File, docType: WelcomeDocType): Promise<string> {
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

const financeService = new FinanceService()

export { financeService }
