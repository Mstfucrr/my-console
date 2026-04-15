'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProfile } from '@/context/ProfileProvider'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useStoreApplicationWizard } from '../context/StoreApplicationWizardContext'
import { merchantPriceService } from '../service/merchant-price.service'

const INPUT_ID = 'estimated-package-unit-price'

export function EstimatedPackageUnitPriceHint() {
  const { locationForm } = useStoreApplicationWizard()
  const { profile } = useProfile()
  const cityId = locationForm.watch('city.id')
  const countyId = locationForm.watch('county.id')

  const ready = Boolean(cityId?.trim() && countyId?.trim())

  const vkn = useMemo(() => profile?.data?.taxNumber ?? '', [profile])

  const { data: price, isLoading: isPriceLoading } = useQuery({
    queryKey: ['store-applications', 'estimated-package-unit-price', cityId, countyId, vkn],
    queryFn: () =>
      merchantPriceService.getEstimatedPackageUnitPrice({
        cityId: cityId!,
        countyId: countyId!,
        vkn: vkn
      }),
    enabled: ready
  })

  const value = ready && !isPriceLoading && price != null ? String(price) : ''
  const placeholder = !ready ? 'Konum bilgisi gereklidir' : isPriceLoading ? 'Yükleniyor...' : '—'

  return (
    <div className='h-fit space-y-2'>
      <Label htmlFor={INPUT_ID} className='text-sm font-medium'>
        Tahmini Paket Başı Fiyat (₺)
      </Label>
      <Input
        id={INPUT_ID}
        readOnly
        tabIndex={10}
        value={value}
        placeholder={placeholder}
        className='w-full font-semibold'
        disabled
      />
    </div>
  )
}
