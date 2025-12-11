import { privateAxiosInstance } from '@/lib/axios'
import type { IProfileResponse } from '@/types/profile'

class ProfileService {
  async getProfile(): Promise<IProfileResponse> {
    const { data } = await privateAxiosInstance.get<IProfileResponse>('/auth/profile')
    return data
  }
}

const profileService = new ProfileService()

export { profileService }
