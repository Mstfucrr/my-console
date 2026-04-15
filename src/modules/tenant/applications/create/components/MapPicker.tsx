'use client'

import Leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useCallback, useEffect, useRef } from 'react'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'

Leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
})

function DraggableMarker({
  position,
  onDragEnd
}: {
  position: [number, number]
  onDragEnd: (lat: number, lng: number) => void
}) {
  return (
    <Marker
      key={`${position[0]},${position[1]}`}
      draggable
      position={position}
      eventHandlers={{
        dragend: e => {
          const ll = e.target.getLatLng()
          onDragEnd(ll.lat, ll.lng)
        }
      }}
    />
  )
}

function StaticMarker({ position }: { position: [number, number] }) {
  return <Marker position={position} draggable={false} />
}

function MapClickHandler({ onPositionChange }: { onPositionChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: e => {
      onPositionChange(e.latlng.lat, e.latlng.lng)
    }
  })
  return null
}

export function MapPicker({
  latitude,
  longitude,
  onPositionChange,
  interactive = true
}: {
  latitude: number
  longitude: number
  onPositionChange?: (lat: number, lng: number) => void
  interactive?: boolean
}) {
  const ref = useRef<Leaflet.Map>(null)

  const position: [number, number] = [latitude, longitude]
  /** react-leaflet MapContainer center prop mount sonrası güncellenmez; koordinat değişince tam remount şart */
  const stableOnChange = useCallback(
    (lat: number, lng: number) => {
      onPositionChange?.(lat, lng)
    },
    [onPositionChange]
  )

  useEffect(() => {
    if (!ref.current) return
    ref.current.setView([latitude, longitude], ref.current.getZoom() ?? 15)
  }, [latitude, longitude, ref])

  return (
    <MapContainer
      center={position}
      zoom={15}
      className='z-0 h-[320px] w-full overflow-hidden rounded-md border xl:h-auto'
      scrollWheelZoom={interactive}
      dragging={interactive}
      doubleClickZoom={interactive}
      boxZoom={interactive}
      keyboard={interactive}
      ref={ref}
    >
      <TileLayer
        referrerPolicy='origin'
        attribution='&copy; OpenStreetMap'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {interactive && onPositionChange ? (
        <>
          <DraggableMarker position={position} onDragEnd={stableOnChange} />
          <MapClickHandler onPositionChange={stableOnChange} />
        </>
      ) : (
        <StaticMarker position={position} />
      )}
    </MapContainer>
  )
}
