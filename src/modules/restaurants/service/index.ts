import { mockRestaurants } from '@/modules/mockData'
import type { Restaurant } from '@/modules/types'

export const restaurantsService = {
  async getRestaurants(): Promise<{ success: boolean; data: Restaurant[] }> {
    // simulate latency
    await new Promise(r => setTimeout(r, 450))
    return { success: true, data: mockRestaurants }
  }
}
