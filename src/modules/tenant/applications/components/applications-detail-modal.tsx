import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogContentInner,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { TenantStoreDetailBody, TenantStoreDetailSkeleton } from '@/modules/tenant/components/tenant-store-detail-body'
import { useQuery } from '@tanstack/react-query'
import { FileTextIcon } from 'lucide-react'
import { useState } from 'react'
import { storeApplicationsService } from '../service/applications.service'

export function ApplicationsDetailModal({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['store-applications', 'detail', id],
    queryFn: () => storeApplicationsService.getStoreApplication(id),
    enabled: Boolean(id) && open,
    staleTime: 1000 * 60 * 5 // 5 dakika
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='icon-sm' variant='outline' color='default'>
          <span className='sr-only'>Detaylar</span>
          <FileTextIcon className='size-4' />
        </Button>
      </DialogTrigger>
      <DialogContent size='4xl' className='gap-0'>
        <DialogHeader className='mr-10 flex flex-row items-center justify-between gap-2'>
          <DialogTitle>Başvuru Detayı</DialogTitle>
        </DialogHeader>
        <DialogContentInner>
          {isLoading && <TenantStoreDetailSkeleton />}
          {isError && <p className='text-destructive text-sm'>Başvuru bilgileri yüklenirken bir hata oluştu.</p>}
          {!isLoading && !isError && data && (
            <TenantStoreDetailBody data={data} dateLabel='Başvuru tarihi' statusSource='application' />
          )}
        </DialogContentInner>
      </DialogContent>
    </Dialog>
  )
}
