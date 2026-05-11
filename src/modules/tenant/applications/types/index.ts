export type { StoreWorkingHourInterval, StoreWorkingHoursDay, StoreWorkingHoursFe } from './working-hours'

export interface StoreApplicationRecord {
  StoreApplicationId: string
  Status: number
  RestaurantName: string
  City: string
  Sector: string | null
  SubSector: string | null
  CreatedOn: string
}

export interface StoreApplicationDetailRecord {
  StoreApplicationId: string
  MerchantId: string
  Status: number
  RestaurantName: string
  City: string
  Sector: string
  SubSector: string
  Payload: StoreApplicationPayload
  CreatedOn: string
  ModifiedOn: string | null
  documentUrls: DocumentUrls
}

export interface DocumentUrls {
  taxDocumentUrl?: string | null
  signatureCircularUrl?: string | null
  idFrontUrl?: string | null
  idBackUrl?: string | null
}

export interface StoreApplicationPayload {
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
  workingHours: StoreApplicationWorkingHour[]
  sector: string
  subSectors: Array<string>
}

export interface StoreApplicationWorkingHour {
  day: string
  enabled: boolean
  start: string | null
  end: string | null
}
