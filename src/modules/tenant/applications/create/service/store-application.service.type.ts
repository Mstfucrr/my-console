export type SectorOption = {
  sector: string
  subSectors: string[]
}

/** GET /merchant/store/sectors */
export type GetSectorsResponse = {
  data: SectorOption[]
}

/** POST /merchant/store/applications — request body */
export type CreateStoreApplicationPayload = {
  restaurantName: string
  city: string
  district: string
  neighborhood: string
  street: string
  doorNumber: string
  fullAddress: string
  latitude: number
  longitude: number
  sector: string
  subSectors: string[]
  dailyPackageEstimate: number
  workingHours: {
    day: string
    enabled: boolean
    start: string | null
    end: string | null
  }[]
  authFirstName: string
  authSurname: string
  authPhoneNumber: string
  authEmail: string
}

/** POST /merchant/store/applications — response body */
export type CreateStoreApplicationResponse = {
  storeApplicationId: string
  status: string
  message: string
}
