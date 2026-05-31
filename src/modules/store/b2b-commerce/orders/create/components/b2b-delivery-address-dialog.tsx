'use client'

import { FormCommandSelectField } from '@/components/form/FormCommandSelectField'
import { FormInputField } from '@/components/form/FormInputField'
import { FormTextareaField } from '@/components/form/FormTextareaField'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogContentInner,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useTurkishAddressCascade } from '@/hooks/useTurkishAddressCascade'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useB2BCheckout } from '../context/B2BCheckoutContext'

type DeliveryAddressMode = 'restaurant' | 'custom'

const b2bDeliveryAddressSchema = z.object({
  city: z.object({
    id: z.string().min(1, ''),
    name: z.string()
  }),
  county: z.object({
    id: z.string().min(1, ''),
    name: z.string()
  }),
  district: z.object({
    id: z.string().min(1, ''),
    name: z.string()
  }),
  street: z.string().min(1, '').max(120, 'Sokak en fazla 120 karakter olabilir'),
  doorNumber: z.string().min(1, '').max(20, 'Kapı numarası en fazla 20 karakter olabilir'),
  buildingNumber: z.string().max(20).optional().default(''),
  floor: z.string().max(3).optional().default(''),
  buildingName: z.string().max(100).optional().default(''),
  fullAddress: z.string().min(1, '').max(500, 'Açık adres en fazla 500 karakter olabilir')
})

type B2BDeliveryAddressFormData = z.infer<typeof b2bDeliveryAddressSchema>

const defaultDeliveryAddressValues: B2BDeliveryAddressFormData = {
  city: { id: '', name: '' },
  county: { id: '', name: '' },
  district: { id: '', name: '' },
  street: '',
  doorNumber: '',
  buildingNumber: '',
  floor: '',
  buildingName: '',
  fullAddress: ''
}

export function B2BDeliveryAddressDialog() {
  const checkout = useB2BCheckout()

  if (!checkout.isAddressDialogOpen) return null

  return <B2BDeliveryAddressDialogContent {...checkout} />
}

function B2BDeliveryAddressDialogContent({
  closeAddressDialog,
  restaurantAddress,
  selectedDeliveryAddress,
  selectDeliveryAddress
}: Pick<
  ReturnType<typeof useB2BCheckout>,
  'closeAddressDialog' | 'restaurantAddress' | 'selectedDeliveryAddress' | 'selectDeliveryAddress'
>) {
  const form = useForm<B2BDeliveryAddressFormData>({
    resolver: zodResolver(b2bDeliveryAddressSchema),
    defaultValues: defaultDeliveryAddressValues
  })

  const {
    cityId,
    countyId,
    districtId,
    handleCityChange,
    handleCountyChange,
    handleDistrictChange,
    handleStreetChange,
    provinceOptions,
    countyOptions,
    districtOptions,
    streetOptions,
    isLoadingProvinces,
    isLoadingCounties,
    isLoadingDistricts,
    isLoadingStreets
  } = useTurkishAddressCascade<B2BDeliveryAddressFormData>(form, {
    fullAddressFormat: 'store'
  })

  const [mode, setMode] = useState<DeliveryAddressMode>(
    selectedDeliveryAddress && selectedDeliveryAddress !== restaurantAddress ? 'custom' : 'restaurant'
  )

  const handleSave = async () => {
    if (mode === 'restaurant') {
      if (!restaurantAddress) return
      selectDeliveryAddress(restaurantAddress)
      closeAddressDialog()
      return
    }

    const isValid = await form.trigger()
    if (!isValid) return

    selectDeliveryAddress(form.getValues('fullAddress'))
    closeAddressDialog()
  }

  const handleModeChange = (value: string) => {
    setMode(value as DeliveryAddressMode)
    if (value === 'restaurant') form.reset()
  }

  return (
    <Dialog open onOpenChange={open => !open && closeAddressDialog()}>
      <DialogContent size='2xl' className='z-1001' overlayClass='z-1000'>
        <DialogHeader>
          <DialogTitle>Teslimat Adresi</DialogTitle>
        </DialogHeader>

        <DialogContentInner className='space-y-4 pb-2'>
          <RadioGroup value={mode} onValueChange={handleModeChange} className='grid gap-3 sm:grid-cols-2'>
            <Label className='border-border/70 bg-secondary/20 flex cursor-pointer items-start gap-3 rounded-xl border p-3'>
              <RadioGroupItem id='b2b-restaurant-address' value='restaurant' />
              <span className='min-w-0 space-y-1'>
                <span className='text-foreground block text-sm font-semibold'>Restoran adresi</span>
                <span className='text-muted-foreground line-clamp-3 text-xs'>
                  {restaurantAddress || 'Profil bilgisinden restoran adresi bekleniyor.'}
                </span>
              </span>
            </Label>

            <Label className='border-border/70 bg-secondary/20 flex cursor-pointer items-start gap-3 rounded-xl border p-3'>
              <RadioGroupItem id='b2b-custom-address' value='custom' />
              <span className='min-w-0 space-y-1'>
                <span className='text-foreground block text-sm font-semibold'>Farklı adres</span>
                <span className='text-muted-foreground line-clamp-3 text-xs'>
                  İl, ilçe, mahalle, sokak ve kapı no seçerek yeni teslimat adresi oluştur.
                </span>
              </span>
            </Label>
          </RadioGroup>

          {mode === 'custom' && (
            <Form {...form}>
              <div className='grid grid-cols-2 gap-x-4 gap-y-3'>
                <FormCommandSelectField
                  name='city.id'
                  required
                  autoFocus
                  control={form.control}
                  label='İl'
                  formItemClassName='max-sm:col-span-2'
                  placeholder='İl seçin'
                  options={provinceOptions || []}
                  isLoading={isLoadingProvinces}
                  onValueChange={handleCityChange}
                />
                <FormCommandSelectField
                  name='county.id'
                  required
                  tabIndex={1}
                  control={form.control}
                  label='İlçe'
                  formItemClassName='max-sm:col-span-2'
                  placeholder='İlçe seçin'
                  options={countyOptions || []}
                  isLoading={isLoadingCounties}
                  disabled={!cityId}
                  onValueChange={handleCountyChange}
                />
                <FormCommandSelectField
                  name='district.id'
                  required
                  tabIndex={2}
                  control={form.control}
                  label='Mahalle'
                  formItemClassName='max-sm:col-span-2'
                  placeholder='Mahalle seçin'
                  options={districtOptions || []}
                  isLoading={isLoadingDistricts}
                  disabled={!countyId}
                  onValueChange={handleDistrictChange}
                />
                <FormCommandSelectField
                  name='street'
                  required
                  tabIndex={3}
                  control={form.control}
                  label='Sokak'
                  formItemClassName='max-sm:col-span-2'
                  placeholder='Sokak seçin veya yazın'
                  allowCustomValue
                  options={streetOptions || []}
                  isLoading={isLoadingStreets}
                  disabled={!districtId}
                  onValueChange={handleStreetChange}
                />
                <FormInputField
                  name='doorNumber'
                  required
                  tabIndex={4}
                  control={form.control}
                  label='Kapı No'
                  placeholder='5'
                  formItemClassName='max-sm:col-span-2'
                  regexPattern={/^[a-zA-Z0-9\s]{0,5}$/}
                />
                <FormTextareaField
                  name='fullAddress'
                  required
                  control={form.control}
                  label='Açık Adres'
                  className='resize-none'
                  formItemClassName='col-span-2'
                  disabled
                  readOnly
                  rows={3}
                />
              </div>
            </Form>
          )}
        </DialogContentInner>

        <DialogFooter>
          <Button type='button' variant='outline' color='secondary' onClick={closeAddressDialog}>
            Vazgeç
          </Button>
          <Button type='button' onClick={handleSave}>
            Adresi Kullan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
