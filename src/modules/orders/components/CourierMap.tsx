'use client'

import type { CourierInfo } from '@/modules/types'
import Leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

// Fix Leaflet icons
Leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
})

interface CourierMapProps {
  courierInfo: CourierInfo
  courierPosition: [number, number]
  customerPosition: [number, number]
}

export default function CourierMap({ courierInfo, courierPosition, customerPosition }: CourierMapProps) {
  const mapRef = useRef<Leaflet.Map | null>(null)

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(courierPosition, 15)
    }
  }, [courierPosition])

  return (
    <MapContainer
      center={courierPosition}
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

      {/* Courier Marker */}
      <Marker position={courierPosition}>
        <Popup>
          <div className='text-center'>
            <div className='font-semibold text-blue-600'>🚚 Kurye</div>
            <div className='text-sm'>{courierInfo.name}</div>
            {courierInfo.licensePlate && (
              <div className='text-muted-foreground text-xs'>{courierInfo.licensePlate}</div>
            )}
          </div>
        </Popup>
      </Marker>

      {/* Customer Marker */}
      <Marker position={customerPosition}>
        <Popup>
          <div className='text-center'>
            <div className='font-semibold text-green-600'>🏠 Teslimat Adresi</div>
            <div className='text-sm'>Müşteri Konumu</div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  )
}
