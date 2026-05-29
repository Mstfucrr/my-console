'use client'

import type { CourierInfo } from '@/types'
import Leaflet from 'leaflet'
import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'

import MapLoading from '@/components/map-loaging'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import useIsTabActive from '@/hooks/use-is-tab-active'
import { useQuery } from '@tanstack/react-query'
import 'leaflet/dist/leaflet.css'
import { AlertTriangle } from 'lucide-react'
import { ordersService } from '../../service/order.service'

const iconUrl = '/images/courier/busy.png'

const courierIcon = new Leaflet.Icon({
  iconUrl: iconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
})

// Fix Leaflet icons
Leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
})

interface CourierMapProps {
  orderId?: string
  orderSId?: string
  courierInfo: CourierInfo
  courierPosition: [number, number]
  customerPosition?: [number, number]
  customerName?: string
}

export default function CourierMap({
  orderId,
  orderSId,
  courierInfo,
  courierPosition,
  customerPosition,
  customerName
}: CourierMapProps) {
  const mapRef = useRef<Leaflet.Map | null>(null)

  const isTabActive = useIsTabActive(10)

  const courierTrackId = useMemo(() => {
    if (orderSId) return orderSId
    if (orderId) return orderId
    return undefined
  }, [orderSId, orderId])

  const {
    data: courierTrack,
    isError,
    refetch,
    isLoading,
    isFetching
  } = useQuery({
    queryKey: ['courier-track', courierTrackId],
    queryFn: () => ordersService.courierTrack(courierTrackId!),
    enabled: Boolean(courierTrackId) && isTabActive,
    refetchIntervalInBackground: false,
    refetchInterval: 60 * 1000,
    staleTime: 0
  })

  const currentCourierPosition = useMemo(() => {
    if (courierTrack?.log?.[0]) {
      return [courierTrack.log[0].lat, courierTrack.log[0].lng] as [number, number]
    }
    return courierPosition
  }, [courierTrack, courierPosition])

  const pathPositions = useMemo(() => {
    if (!courierTrack?.log) return []
    return courierTrack.log.map(point => [point.lat, point.lng] as [number, number])
  }, [courierTrack])

  useEffect(() => {
    if (mapRef.current && currentCourierPosition) {
      mapRef.current.setView(currentCourierPosition, 15)
    }
  }, [currentCourierPosition])

  if (isError) {
    return (
      <div className='flex w-full items-start justify-center'>
        <Alert className='w-auto text-center text-sm' color='destructive' variant='outline'>
          <AlertTriangle className='mt-2' />
          <AlertDescription className='flex items-center gap-2'>
            Kurye takip bilgisi alınamadı. Lütfen daha sonra tekrar deneyin.
            <RefreshButton onClick={() => refetch()} isLoading={isFetching} isIconButton color='info' variant='ghost' />
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading) return <MapLoading />

  return (
    <MapContainer
      center={currentCourierPosition}
      zoom={15}
      style={{ height: '100%', width: '100%' }}
      className='rounded-b-lg'
      ref={(map: Leaflet.Map | null) => {
        if (map) {
          mapRef.current = map
        }
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      {pathPositions.length > 0 && <Polyline positions={pathPositions} pathOptions={{ color: '#3b82f6', weight: 4 }} />}

      <Marker position={currentCourierPosition} icon={courierIcon}>
        <Popup>
          <div className='text-center'>
            <span className='ph-sensitive text-xs'>{courierInfo.name}</span>
            {courierInfo.licensePlate && (
              <div className='text-muted-foreground ph-sensitive text-xs'>{courierInfo.licensePlate}</div>
            )}
          </div>
        </Popup>
      </Marker>

      {/* Customer Marker */}
      {customerPosition && (
        <Marker position={customerPosition}>
          <Popup>
            <span className='ph-sensitive text-center text-sm'>{customerName}</span>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
}
