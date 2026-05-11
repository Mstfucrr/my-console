import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { phoneLabel } from '@/lib/phoen-label'
import { cn } from '@/lib/utils'
import { formatDateTR } from '@/lib/utils/date'
import { Building2Icon, ClockIcon, UserIcon } from 'lucide-react'
import { STORE_APPLICATION_STATUS_COLORS } from '../applications/constants'
import { StoreApplicationDetailRecord } from '../applications/types'
import { workingHoursApiToFe } from '../applications/utils/working-hours-map'
import { useStoreApplicationStatusesQuery } from '../hooks/useStoreApplicationStatusesQuery'
import { getStoreStatusColor, getStoreStatusLabel } from '../stores/constants'
import { StoreDetailRecord } from '../stores/types'
import { TenantStoreWorkingHoursTable } from './tenant-store-working-hours-table'

export type TenantStoreDetailStatusSource = 'application' | 'store'

export function TenantStoreDetailSkeleton() {
  return (
    <div className='flex flex-col gap-4 py-1'>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <Skeleton className='h-72 w-full rounded-xl' />
        <Skeleton className='h-72 w-full rounded-xl' />
      </div>
      <Skeleton className='h-48 w-full rounded-xl' />
    </div>
  )
}

function ApplicationStatusBadge({ statusCode, className }: { statusCode: number; className?: string }) {
  const { data: statuses = [] } = useStoreApplicationStatusesQuery()
  const label = statuses.find(s => s.code === statusCode)?.value ?? statusCode
  const color = STORE_APPLICATION_STATUS_COLORS[statusCode] ?? 'secondary'

  return (
    <Badge variant='outline' color={color} className={cn('shrink-0', className)}>
      {label}
    </Badge>
  )
}

function StoreRecordStatusBadge({ statusCode, className }: { statusCode: number; className?: string }) {
  const label = getStoreStatusLabel(statusCode)
  const color = getStoreStatusColor(statusCode)
  return (
    <Badge variant='outline' color={color} className={cn('shrink-0', className)}>
      {label}
    </Badge>
  )
}

function FooterStatusBadge({
  statusCode,
  source,
  className = 'max-sm:ml-2'
}: {
  statusCode: number
  source: TenantStoreDetailStatusSource
  className?: string
}) {
  if (source === 'store') return <StoreRecordStatusBadge statusCode={statusCode} className={className} />
  return <ApplicationStatusBadge statusCode={statusCode} className={className} />
}

export function TenantStoreDetailBody({
  data,
  dateLabel,
  statusSource
}: {
  data: StoreDetailRecord | StoreApplicationDetailRecord
  dateLabel: string
  statusSource: TenantStoreDetailStatusSource
}) {
  const p = data.Payload
  const dailyEstimate = p.dailyPackageEstimate != null ? String(p.dailyPackageEstimate) : '—'

  return (
    <div className='overflow-y-auto'>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <Building2Icon className='h-4 w-4' />
              Şube Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-start justify-between gap-2'>
              <span className='text-muted-foreground text-sm text-nowrap'>Şube adı</span>
              <span className='pl-6 text-right text-sm leading-relaxed'>{p.restaurantName}</span>
            </div>
            <Separator />
            <div className='flex items-center justify-between gap-y-1 max-md:flex-col max-md:items-start'>
              <span className='text-muted-foreground text-sm'>Günlük paket tahmini</span>
              <span className='text-sm max-sm:ml-2 max-sm:text-xs'>{dailyEstimate}</span>
            </div>
            <div className='flex items-center justify-between gap-y-1 max-md:flex-col max-md:items-start'>
              <span className='text-muted-foreground text-sm'>Sektör</span>
              <span className='text-sm max-sm:ml-2 max-sm:text-xs'>{p.sector}</span>
            </div>
            <div className='flex items-start justify-between gap-2'>
              <span className='text-muted-foreground text-sm text-nowrap'>Alt sektörler</span>
              <div className='flex min-w-0 flex-1 flex-wrap justify-end gap-1 sm:text-right'>
                {p.subSectors.map((subSector: string) => (
                  <Badge key={subSector} variant='outline' color='secondary' className='px-1.5 py-0.5 text-xs'>
                    {subSector}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div className='flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-2'>
              <span className='text-muted-foreground text-sm text-nowrap'>Tam adres</span>
              <div className='min-w-0 flex-1 sm:text-right'>
                <span className='text-sm leading-relaxed'>{p.fullAddress}</span>
              </div>
            </div>
            <Separator />
            <div className='flex items-center justify-between gap-y-1 max-md:flex-col max-md:items-start'>
              <span className='text-muted-foreground text-sm'>{dateLabel}</span>
              <span className='text-sm max-sm:ml-2 max-sm:text-xs'>{formatDateTR(data.CreatedOn, true)}</span>
            </div>
            <div className='flex items-center justify-between gap-y-1 max-md:flex-col max-md:items-start'>
              <span className='text-muted-foreground text-sm'>Durum</span>
              <FooterStatusBadge statusCode={data.Status} source={statusSource} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <UserIcon className='h-4 w-4' />
              Yetkili Kişi
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-center justify-between gap-y-1 max-md:flex-col max-md:items-start'>
              <span className='text-muted-foreground text-sm'>Ad soyad</span>
              <span className='text-sm max-sm:ml-2 max-sm:text-xs'>
                {[p.authFirstName, p.authSurname].filter(Boolean).join(' ')}
              </span>
            </div>
            <Separator />
            <div className='flex items-center justify-between gap-y-1 max-md:flex-col max-md:items-start'>
              <span className='text-muted-foreground text-sm'>E-posta</span>
              <span className='text-sm max-sm:ml-2 max-sm:text-xs'>{p.authEmail}</span>
            </div>
            <div className='flex items-center justify-between gap-y-1 max-md:flex-col max-md:items-start'>
              <span className='text-muted-foreground text-sm'>Telefon</span>
              <span className='text-sm max-sm:ml-2 max-sm:text-xs'>{phoneLabel(p.authPhoneNumber)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <ClockIcon className='h-4 w-4' />
              Çalışma Saatleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TenantStoreWorkingHoursTable hours={workingHoursApiToFe(p.workingHours)} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
