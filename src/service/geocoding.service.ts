const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org'

type NominatimSearchItem = {
  lat?: string
  lon?: string
}

export type NominatimAddress = {
  province?: string
  state?: string
  city?: string
  town?: string
  county?: string
  municipality?: string
  city_district?: string
  state_district?: string
  suburb?: string
  neighbourhood?: string
  quarter?: string
  village?: string
  hamlet?: string
  road?: string
  pedestrian?: string
}

type NominatimReverseResponse = {
  address?: NominatimAddress
}

function buildHeaders() {
  return {
    Accept: 'application/json'
  }
}

export async function searchCoordinatesByAddress(query: string, signal?: AbortSignal) {
  const url = new URL(`${NOMINATIM_BASE_URL}/search`)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '1')
  url.searchParams.set('countrycodes', 'tr')
  url.searchParams.set('q', query)

  const response = await fetch(url.toString(), {
    signal,
    headers: buildHeaders()
  })
  if (!response.ok) return null

  const data = (await response.json()) as NominatimSearchItem[]
  const match = data[0]
  if (!match?.lat || !match?.lon) return null

  const latitude = Number.parseFloat(match.lat)
  const longitude = Number.parseFloat(match.lon)
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null

  return { latitude, longitude }
}

export async function reverseGeocodeCoordinates(latitude: number, longitude: number, signal?: AbortSignal) {
  const url = new URL(`${NOMINATIM_BASE_URL}/reverse`)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('lat', latitude.toString())
  url.searchParams.set('lon', longitude.toString())
  url.searchParams.set('zoom', '18')
  url.searchParams.set('addressdetails', '1')

  const response = await fetch(url.toString(), {
    signal,
    headers: buildHeaders()
  })
  if (!response.ok) return null

  const data = (await response.json()) as NominatimReverseResponse
  return data.address ?? null
}
