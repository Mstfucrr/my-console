import type { Restaurant } from "@/modules/orders/types"
import { mockRestaurants } from "@/modules/orders/mockData"

export const restaurantsService = {
  async getRestaurants(): Promise<{ success: boolean; data: Restaurant[] }> {
    // simulate latency
    await new Promise((r) => setTimeout(r, 450))
    return { success: true, data: mockRestaurants }
  },
}
