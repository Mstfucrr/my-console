// Backend ProfileResponse'a uygun
export interface IProfileResponse {
  userId: string
  accountId: string
  email: string
  restaurantId: string
  omsRestaurantId: string
  tab_fr?: boolean
  info?: IProfileInfo
}

export interface IProfileInfo {
  externalId: string
  accountId: string
  channelId: string
  lng: number
  brandId: string
  channelRestaurantId: string
  createdAt: number
  id: string
  lat: number
  name: string
  state: string
  isAtaExpressActive: boolean
  hubId: string
  isCarrierTrackEnable: boolean
  authPhone: string
  isOrderIntegrationEnabled: boolean
  iv: number
  workingHours: IProfileWorkingHour[]
  isActiveForPackageService: boolean
  isOpenForPackageService: boolean
  isPartnerEnabled: boolean
  updatedAt: number
}

export interface IProfileWorkingHour {
  closingTime: string
  dayOfWeek: string
  openingTime: string
}
