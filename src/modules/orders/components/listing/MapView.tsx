'use client'

import { TooltippedElement } from '@/components/tooltipped-element'
import { Button } from '@/components/ui/button'
import { MaskedText } from '@/components/ui/masked-text'
import { ORDER_STATUS_TEXT_COLORS, OrderStatusGroup } from '@/constants'
import { cn } from '@/lib/utils'
import { maskLastName } from '@/lib/utils/mask'
import { MAP_THEMES, useMapThemeStore } from '@/store/map-theme'
import { Order, OrderStatusesGroups } from '@/types'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  GripHorizontal,
  Info,
  LucideProps,
  MapPinCheckInside,
  MapPinIcon,
  MapPinXInsideIcon,
  type LucideIcon
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css'
import { useOrders } from '../../context/OrdersContext'
import { OrderDetailDialog } from './OrderDetailDialog'

const MIN_HEIGHT = 256
const MAX_HEIGHT = 600
const DEFAULT_HEIGHT = 384

function lucideToSvgString(Icon: LucideIcon, opts?: LucideProps) {
  const { size = 28, strokeWidth = 4, className, ...rest } = opts ?? {}
  return renderToStaticMarkup(
    <Icon width={size} height={size} strokeWidth={strokeWidth} className={className} {...rest} />
  )
}

// Example: Using a Lucide icon (e.g., MapPin) as the marker icon with SVG

const createCustomerIcon = (params: { status: OrderStatusesGroups }) => {
  const { status } = params
  const Icon =
    status === OrderStatusesGroups.DELIVERED
      ? MapPinCheckInside
      : status === OrderStatusesGroups.CANCELLED
        ? MapPinXInsideIcon
        : MapPinIcon

  const svg = lucideToSvgString(Icon, {
    size: 23,
    color: OrderStatusGroup[status]?.color,
    stroke: OrderStatusGroup[status]?.color,
    fill: '#fff',
    className: cn(ORDER_STATUS_TEXT_COLORS[status], 'drop-shadow-lg')
  })

  return new L.DivIcon({
    className: 'custom-marker',
    html: svg,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  })
}

export function MapView() {
  const mapRef = useRef<L.Map | null>(null)
  const lastAppliedPosition = useRef<[number, number] | null>(null)
  const [height, setHeight] = useState(DEFAULT_HEIGHT)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const { activeOrders, completedOrders } = useOrders()

  // Tüm orders'ı birleştir
  const orders = useMemo(() => [...(activeOrders ?? []), ...(completedOrders ?? [])], [activeOrders, completedOrders])

  const { mapTheme, toggleMapTheme } = useMapThemeStore()

  const lastOrderPosition = useMemo(
    () => orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.customerPosition,
    [orders]
  )

  useEffect(() => {
    if (!mapRef.current || !lastOrderPosition) return

    const isSamePosition =
      lastAppliedPosition.current?.[0] === lastOrderPosition[0] &&
      lastAppliedPosition.current?.[1] === lastOrderPosition[1]

    if (isSamePosition) return
    mapRef.current.setView(lastOrderPosition, mapRef.current.getZoom() ?? 12)
    lastAppliedPosition.current = lastOrderPosition
  }, [lastOrderPosition])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      const startY = e.clientY
      const startHeight = height

      const handleMouseMove = (e: MouseEvent) => {
        const newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, startHeight + e.clientY - startY))
        setHeight(newHeight)
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        mapRef.current?.invalidateSize()
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [height]
  )

  const handleCloseModal = () => {
    setSelectedOrder(null)
  }

  return (
    <div className='relative z-0'>
      <div style={{ height }} className='overflow-hidden rounded-t-lg border border-b-0'>
        <MapContainer
          center={lastOrderPosition ?? [37.064997, 37.378162]}
          zoom={lastOrderPosition ? 15 : 10}
          className='min-h-full w-full'
          ref={(map: L.Map | null) => {
            if (map) {
              mapRef.current = map
            }
          }}
        >
          <TileLayer key={mapTheme} url={MAP_THEMES[mapTheme].url} attribution={MAP_THEMES[mapTheme].attribution} />
          <MarkerClusterGroup
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
            zoomToBoundsOnClick={true}
            spiderfyDistanceMultiplier={2}
          >
            {orders.map(order => (
              <Marker
                key={order.orderId}
                position={order.customerPosition!}
                icon={createCustomerIcon({ status: order.status })}
              >
                <Popup>
                  <div className='flex items-center gap-1'>
                    <MaskedText maskFn={maskLastName} value={order.customerName} textClassName='text-nowrap' />

                    <TooltippedElement tooltipContent='Sipariş Detayı'>
                      <Button size='icon-xs' variant='link' onClick={() => setSelectedOrder(order)}>
                        <Info className='size-4' />
                      </Button>
                    </TooltippedElement>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      <div
        onMouseDown={handleMouseDown}
        className='bg-muted/50 hover:bg-muted flex h-5 cursor-row-resize items-center justify-center rounded-b-lg border transition-colors'
      >
        <GripHorizontal className='text-muted-foreground h-4 w-4' />
      </div>

      <div className='absolute top-2 right-2 z-1000'>
        <Button color='light' size='xs' onClick={toggleMapTheme} className='rounded-none px-2 text-sm shadow-md'>
          {MAP_THEMES[mapTheme]?.label}
        </Button>
      </div>

      <OrderDetailDialog order={selectedOrder} onClose={handleCloseModal} />
    </div>
  )
}
