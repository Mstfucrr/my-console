import { workingHoursFeToApi } from '../../utils/working-hours-map'
import type { CreateStoreApplicationPayload } from '../service/store-application.service.type'
import type { CreateStoreApplicationFormData } from '../types'

export function buildStoreApplicationPayload(values: CreateStoreApplicationFormData): CreateStoreApplicationPayload {
  const trimmedValues: CreateStoreApplicationFormData = Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
  ) as CreateStoreApplicationFormData

  const workingHours = workingHoursFeToApi(trimmedValues.workingHours)

  return {
    authEmail: trimmedValues.authEmail,
    authFirstName: trimmedValues.authFirstName,
    authSurname: trimmedValues.authSurname,
    authPhoneNumber: trimmedValues.authPhoneNumber,
    city: trimmedValues.city.name,
    dailyPackageEstimate: Number.parseInt(trimmedValues.dailyPackageEstimate, 10),
    district: trimmedValues.county.name,
    fullAddress: trimmedValues.fullAddress,
    latitude: trimmedValues.latitude,
    longitude: trimmedValues.longitude,
    neighborhood: trimmedValues.district.name,
    restaurantName: trimmedValues.restaurantName,
    street: trimmedValues.street,
    doorNumber: trimmedValues.doorNumber,
    workingHours,
    sector: trimmedValues.sector,
    subSectors: trimmedValues.subSectors
  }
}
