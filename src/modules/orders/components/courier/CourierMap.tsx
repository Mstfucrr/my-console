'use client'

import type { CourierInfo } from '@/types'
import Leaflet from 'leaflet'
import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'

import useIsTabActive from '@/hooks/use-is-tab-active'
import { useQuery } from '@tanstack/react-query'
import 'leaflet/dist/leaflet.css'
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
  orderSId?: string
  courierInfo: CourierInfo
  courierPosition: [number, number]
  customerPosition?: [number, number]
  customerName?: string
}

export default function CourierMap({
  orderSId,
  courierInfo,
  courierPosition,
  customerPosition,
  customerName
}: CourierMapProps) {
  const mapRef = useRef<Leaflet.Map | null>(null)

  const isTabActive = useIsTabActive(10)

  const { data: courierTrack } = useQuery({
    queryKey: ['courier-track', orderSId],
    queryFn: () => ordersService.courierTrack(orderSId!),
    enabled: Boolean(orderSId) && isTabActive,
    refetchIntervalInBackground: false,
    refetchInterval: 60 * 1000
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
            <span className='text-xs'>{courierInfo.name}</span>
            {courierInfo.licensePlate && (
              <div className='text-muted-foreground text-xs'>{courierInfo.licensePlate}</div>
            )}
          </div>
        </Popup>
      </Marker>

      {/* Customer Marker */}
      {customerPosition && (
        <Marker position={customerPosition}>
          <Popup>
            <span className='text-center text-sm'>{customerName}</span>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
}
