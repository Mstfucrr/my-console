'use client'

import { Button } from '@/components/ui/button'
import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Download } from 'lucide-react'

interface ReconciliationHeaderProps {
  onRefresh: () => void
  isLoading: boolean
}

export default function ReconciliationHeader({ onRefresh, isLoading }: ReconciliationHeaderProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <div>
          <CardTitle className='mb-1 flex items-center gap-2 text-2xl'>
            <CheckCircle className='text-green-600' /> Mutabakat İşlemleri
          </CardTitle>
          <p className='text-muted-foreground text-sm'>
            Günlük satış mutabakatlarınızı takip edin ve raporlarınızı indirin
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline'>
            <Download className='mr-2 h-4 w-4' />
            Rapor İndir
          </Button>
          <RefreshButton size='xs' onClick={onRefresh} isLoading={isLoading} />
        </div>
      </CardHeader>
    </Card>
  )
}
