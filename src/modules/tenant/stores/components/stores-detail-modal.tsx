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
import { storesService } from '../service/stores.service'

export function StoreDetailModal({ storeId }: { storeId: string }) {
  const [open, setOpen] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['store', 'detail', storeId],
    queryFn: () => storesService.getStore(storeId),
    enabled: Boolean(storeId) && open
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
          <DialogTitle>Şube Detayı</DialogTitle>
        </DialogHeader>
        <DialogContentInner>
          {isLoading && <TenantStoreDetailSkeleton />}
          {isError && <p className='text-destructive text-sm'>Şube bilgileri yüklenirken bir hata oluştu.</p>}
          {!isLoading && !isError && data && (
            <TenantStoreDetailBody data={data} dateLabel='Oluşturulma tarihi' statusSource='store' />
          )}
        </DialogContentInner>
      </DialogContent>
    </Dialog>
  )
}
