'use client'

import { OrderStatusGroup } from '@/constants/orders'
import { cn } from '@/lib/utils'
import { formatDateTimeTR } from '@/lib/utils/date'
import { OrderStatusesGroups, type Order } from '@/types'
import { COMPLETED_ORDER_STATUS_GROUPS } from '../../constants'

interface TimelineStatus {
  status: OrderStatusesGroups
  label: string
  isCompleted: boolean
  isCurrent: boolean
}

const statusOrder: OrderStatusesGroups[] = [
  OrderStatusesGroups.CREATED,
  OrderStatusesGroups.SHIPPED,
  OrderStatusesGroups.DELIVERED,
  OrderStatusesGroups.CANCELLED
]
export function OrderTimeLine({ order }: { order?: Order }) {
  if (!order) return null

  // Status sırası

  // Mevcut status'un index'ini bul
  const currentStatusIndex = statusOrder.indexOf(order.status)

  // Her status için timeline bilgisi oluştur
  const timelineStatuses: TimelineStatus[] = statusOrder.map((status, index) => {
    const isCompleted = index < currentStatusIndex
    const isCurrent = index === currentStatusIndex

    return {
      status,
      label: OrderStatusGroup[status].label,
      isCompleted,
      isCurrent
    }
  })

  // İptal durumunda: Hazırlanıyor, Yola Çıktı, İptal Edildi göster (Teslim Edildi gösterilmez)
  // Normal durumda: Hazırlanıyor, Yola Çıktı, Teslim Edildi göster (İptal Edildi gösterilmez)
  const isCancelled = order.status === OrderStatusesGroups.CANCELLED

  const visibleStatuses = timelineStatuses.filter(s => !COMPLETED_ORDER_STATUS_GROUPS.includes(s.status))

  // İptal durumunda iptal status'ünü ekle, normal durumda teslim status'ünü ekle
  if (isCancelled) {
    const cancelledStatus = timelineStatuses.find(s => s.status === OrderStatusesGroups.CANCELLED)
    if (cancelledStatus) {
      visibleStatuses.push(cancelledStatus)
    }
  } else {
    const deliveredStatus = timelineStatuses.find(s => s.status === OrderStatusesGroups.DELIVERED)
    if (deliveredStatus) {
      visibleStatuses.push(deliveredStatus)
    }
  }

  return (
    <div className='w-full rounded-lg border border-dashed border-gray-300 p-2'>
      <div className='relative flex w-full items-start justify-between'>
        {/* Timeline connecting line */}
        {visibleStatuses.length > 1 && (
          <div
            className='absolute top-4 h-0.5 border-t border-dashed border-gray-300'
            style={{ left: '15%', width: '70%' }}
          />
        )}

        {/* Status nodes */}
        {visibleStatuses.map(statusItem => {
          const isActive = statusItem.isCompleted || statusItem.isCurrent
          const statusConfig = OrderStatusGroup[statusItem.status]
          const Icon = statusConfig.icon

          return (
            <div key={statusItem.status} className='relative z-10 flex flex-1 flex-col items-center'>
              {/* Circle node */}
              <div
                className={cn(
                  'bg-background relative flex items-center justify-center rounded-full border-2 p-1 transition-colors',
                  isActive ? 'border-solid' : 'border-dashed border-gray-300 bg-transparent'
                )}
                style={{ borderColor: isActive ? statusConfig.color : undefined }}
              >
                {isActive ? (
                  <div className='rounded-full'>
                    <Icon className='size-5' style={{ color: statusConfig.color }} />
                  </div>
                ) : (
                  <div className='size-4 rounded-full border-2 border-dashed border-gray-300' />
                )}
              </div>

              {/* Status label and time */}
              <div className='mt-2 flex flex-col items-center text-center'>
                <span className={cn('text-xs font-medium', isActive ? 'text-gray-900' : 'text-gray-400')}>
                  {statusItem.label}
                </span>
                {/* Hazırlanıyor için her zaman saat göster, diğerleri için sadece mevcut status'ta */}
                {(statusItem.status === OrderStatusesGroups.CREATED || statusItem.isCurrent) && (
                  <span className='mt-1 text-xs text-gray-700'>
                    {statusItem.status === OrderStatusesGroups.CREATED
                      ? formatDateTimeTR(order.createdAt)
                      : formatDateTimeTR(order.updatedAt)}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
