export interface StoreListRecord {
  RestaurantId: string
  RestaurantName: string
  RestaurantAddress: string | null
  Status: number
  City: string
  CityId: string
  CountyId: string | null
  Latitude: number
  Longitude: number
  IsOpenForPackageService: boolean
  IsActiveForPackageService: boolean
  CreatedOn: string
}

/** Onaylı restoran (şube) — API: GET /api/my-stores (doküman 11.11) */
export interface StoreDetailRecord {
  StoreApplicationId: string
  MerchantId: string
  Status: number
  RestaurantName: string
  City: string
  Sector: string
  SubSector: string
  Payload: Payload
  Next4BizCsmId: string | null
  CreatedOn: string
  ModifiedOn: string | null
  documentUrls: DocumentUrls
}

export interface DocumentUrls {
  taxDocumentUrl: string
  signatureCircularUrl: string
  idFrontUrl: string
  idBackUrl: string
  tradeRegistryGazetteUrl?: string | null
}

export interface Payload {
  authEmail: string
  authFirstName: string
  authSurname: string
  authPhoneNumber: string
  city: string
  dailyPackageEstimate: number
  district: string
  fullAddress: string
  latitude: number
  longitude: number
  neighborhood: string
  restaurantName: string
  street: string
  doorNumber: string
  workingHours: WorkingHour[]
  sector: string
  subSectors: string[]
}

export interface WorkingHour {
  day: string
  enabled: boolean
  start: string | null
  end: string | null
}
