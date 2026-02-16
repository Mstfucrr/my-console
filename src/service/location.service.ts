// API FONKSİYONLARI
import { privateAxiosInstance } from '@/lib/axios'

// TYPES
export type AddressQueryType = 'province' | 'county' | 'district' | 'street'

export interface QueryAddressParams {
  type: AddressQueryType
  provinceName?: string
  provinceId?: number
  countyId?: number
  districtId?: number
}

export interface AddressBase {
  il_id: number
  il_adi: string
}

// Province: Şehir
export type Province = AddressBase

// County: İlçe
export interface County extends AddressBase {
  ilce_id: number
  ilce_adi: string
}

// District: Mahalle
export interface District extends AddressBase {
  mahalle_id: number
  mahalle_adi: string
}

// Street: Sokak
export interface Street extends AddressBase {
  mahalle_id: number
  mahalle_adi: string
  sokak_id: number
  sokak_adi: string
}

// province (şehir) listesi
export async function fetchProvinces(): Promise<Province[]> {
  const { data } = await privateAxiosInstance.get<Province[]>('/location/provinces')
  return data
}

// county (ilçe) listesi (provinceId zorunlu)
export async function fetchCounties(provinceId: number): Promise<County[]> {
  const { data } = await privateAxiosInstance.get<County[]>(
    `/location/query-address?type=county&provinceId=${provinceId}`
  )
  return data
}

// district (mahalle) listesi (countyId zorunlu)
export async function fetchDistricts(countyId: number): Promise<District[]> {
  const { data } = await privateAxiosInstance.get<District[]>(
    `/location/query-address?type=district&countyId=${countyId}`
  )
  return data
}

// street (sokak) listesi (districtId zorunlu)
export async function fetchStreets(districtId: number): Promise<Street[]> {
  const { data } = await privateAxiosInstance.get<Street[]>(
    `/location/query-address?type=street&districtId=${districtId}`
  )
  return data
}

// HOOKS
import { useQuery } from '@tanstack/react-query'

export function useQueryProvinces() {
  return useQuery<Province[]>({
    queryKey: ['provinces'],
    queryFn: () => fetchProvinces()
  })
}

export function useQueryCounties(provinceId?: number, enabled: boolean = true) {
  return useQuery<County[]>({
    queryKey: ['counties', provinceId],
    queryFn: () => {
      if (typeof provinceId !== 'number') throw new Error('Missing provinceId')
      return fetchCounties(provinceId)
    },
    enabled: !!provinceId && enabled
  })
}

export function useQueryDistricts(countyId?: number, enabled: boolean = true) {
  return useQuery<District[]>({
    queryKey: ['districts', countyId],
    queryFn: () => {
      if (typeof countyId !== 'number') throw new Error('Missing countyId')
      return fetchDistricts(countyId)
    },
    enabled: !!countyId && enabled
  })
}

export function useQueryStreets(districtId?: number, enabled: boolean = true) {
  return useQuery<Street[]>({
    queryKey: ['streets', districtId],
    queryFn: () => {
      if (typeof districtId !== 'number') throw new Error('Missing districtId')
      return fetchStreets(districtId)
    },
    enabled: !!districtId && enabled
  })
}
