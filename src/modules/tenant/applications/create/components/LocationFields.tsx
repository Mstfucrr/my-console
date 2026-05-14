'use client'

import { FormCommandSelectField } from '@/components/form/FormCommandSelectField'
import { FormInputField } from '@/components/form/FormInputField'
import { FormTextareaField } from '@/components/form/FormTextareaField'
import { TooltippedElement } from '@/components/tooltipped-element'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { InfoIcon, Loader2Icon, LocateFixedIcon, MapPinIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useWatch } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useStoreApplicationWizard } from '../context/StoreApplicationWizardContext'

const MapPicker = dynamic(() => import('../components/MapPicker').then(m => m.MapPicker), {
  ssr: false,
  loading: () => (
    <div className='bg-muted/40 flex h-[320px] w-full items-center justify-center rounded-md xl:h-auto'>
      Harita yükleniyor...
    </div>
  )
})

export function LocationFields() {
  const {
    locationForm: form,
    addressFields,
    handleMapPositionChange,
    handleUseCurrentLocation,
    isDetectingCurrentLocation,
    mapFillsAddressFromPin,
    setMapFillsAddressFromPin
  } = useStoreApplicationWizard()
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
  } = addressFields

  const latitude = useWatch({ control: form.control, name: 'latitude' })
  const longitude = useWatch({ control: form.control, name: 'longitude' })

  const handleCurrentLocationClick = async () => {
    const didApplyLocation = await handleUseCurrentLocation()
    if (!didApplyLocation) {
      toast.error('Konum alınamadı. Lütfen tarayıcınızın konum paylaşma izinlerini kontrol edin.', {
        autoClose: 5000
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col gap-4 sm:items-start sm:justify-between md:flex-row'>
          <div className='space-y-1.5'>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <MapPinIcon className='size-4.5' /> Şube Konum Bilgileri
            </CardTitle>
          </div>
          <div className='mt-auto flex flex-wrap items-center gap-2 sm:shrink-0'>
            <Button
              type='button'
              variant='outline'
              size='xs'
              onClick={handleCurrentLocationClick}
              disabled={isDetectingCurrentLocation}
              className='gap-2'
            >
              {isDetectingCurrentLocation ? (
                <Loader2Icon className='size-4 animate-spin' />
              ) : (
                <LocateFixedIcon className='size-4' />
              )}
              Mevcut konum
            </Button>
            <Switch
              id='map-fills-address-from-pin'
              checked={mapFillsAddressFromPin}
              onCheckedChange={setMapFillsAddressFromPin}
            />
            <Label
              htmlFor='map-fills-address-from-pin'
              className='text-muted-foreground cursor-pointer text-sm font-normal whitespace-nowrap'
            >
              Haritadan otomatik doldur
            </Label>
            <TooltippedElement
              className='max-w-52'
              tooltipContent='Adresinizi aşağıdaki alanlardan girebilir veya harita üzerinden pin ile seçebilirsiniz.'
              side='bottom'
            >
              <InfoIcon className='size-4.5' />
            </TooltippedElement>
          </div>
        </div>
      </CardHeader>
      <CardContent className='gap-4 space-y-4 xl:flex xl:flex-row'>
        <div className='min-w-1/2'>
          <div className='relative grid grid-cols-2 gap-x-4 gap-y-2 lg:grid-cols-2'>
            <FormCommandSelectField
              autoFocus
              name='city.id'
              required
              control={form.control}
              label='İl'
              formItemClassName='max-sm:col-span-2'
              placeholder='İl seçin'
              options={provinceOptions || []}
              isLoading={isLoadingProvinces}
              onValueChange={handleCityChange}
              tabIndex={1}
            />
            <FormCommandSelectField
              name='county.id'
              required
              control={form.control}
              label='İlçe'
              formItemClassName='max-sm:col-span-2'
              placeholder='İlçe seçin'
              options={countyOptions || []}
              isLoading={isLoadingCounties}
              disabled={!cityId}
              onValueChange={handleCountyChange}
              tabIndex={2}
            />
            <FormCommandSelectField
              name='district.id'
              required
              control={form.control}
              label='Mahalle'
              formItemClassName='max-sm:col-span-2'
              placeholder='Mahalle seçin'
              options={districtOptions || []}
              isLoading={isLoadingDistricts}
              disabled={!countyId}
              onValueChange={handleDistrictChange}
              tabIndex={3}
            />
            <FormCommandSelectField
              name='street'
              required
              control={form.control}
              label='Sokak'
              formItemClassName='max-sm:col-span-2'
              placeholder='Sokak seçin veya yazın'
              allowCustomValue
              options={streetOptions || []}
              isLoading={isLoadingStreets}
              disabled={!districtId}
              onValueChange={handleStreetChange}
              tabIndex={4}
            />
            <FormInputField
              name='doorNumber'
              required
              control={form.control}
              label='Kapı No'
              placeholder='5'
              formItemClassName='max-sm:col-span-2'
              regexPattern={/^[a-zA-Z0-9\s]{0,5}$/}
              tabIndex={5}
            />
          </div>

          <div className='relative grid gap-4'>
            <FormTextareaField
              name='fullAddress'
              control={form.control}
              label='Açık Adres'
              className='col-span-2 resize-none pb-5'
              disabled
              readOnly
              rows={3}
            />

            <span className='text-muted-foreground absolute right-1.5 bottom-0 flex items-center gap-2 text-sm font-normal'>
              <LocateFixedIcon className='size-4' />
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </span>
          </div>
        </div>

        <MapPicker
          key='location-fields-map'
          latitude={latitude ?? 41.0082}
          longitude={longitude ?? 28.9784}
          interactive
          onPositionChange={(lat, lng) => handleMapPositionChange(lat, lng)}
        />
      </CardContent>
    </Card>
  )
}
