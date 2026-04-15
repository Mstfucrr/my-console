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
