export type AccountType = 'tenant' | 'store'

export interface IProfileResponse {
  userId: string
  accountId: string
  email: string
  restaurantId: string
  omsRestaurantId: string
  canB2BCommerce?: boolean
  tab_fr?: boolean
  hubName?: string
  accountType: AccountType
  info?: IProfileInfo
  data?: IProfileData
}

export interface IProfileData {
  merchantId: string
  taxNumber: string
  hasFinancialDetails?: boolean
  firstName: string
  surname: string
  email: string
  phoneNumber: string
  status: string
  updatedAt: string
  financialDetails?: IProfileFinancialDetails | null
}

export interface IProfileFinancialDetails {
  companyType: 'Bireysel' | 'Kurumsal' | null
  companyName: string | null
  taxOffice: string | null
  iban: string | null
  tckn: string | null
  taxDocumentUrl: string | null
  signatureCircularUrl: string | null
  idFrontUrl: string | null
  idBackUrl: string | null
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
  address?: string
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
