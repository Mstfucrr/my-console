'use client'

import { FormCommandSelectField } from '@/components/form/FormCommandSelectField'
import { FormInputField } from '@/components/form/FormInputField'
import { FormSelectField } from '@/components/form/FormSelectField'
import { FormSwitchField } from '@/components/form/FormSwitchField'
import { FormTextareaField } from '@/components/form/FormTextareaField'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { useQueryCounties, useQueryDistricts, useQueryProvinces, useQueryStreets } from '@/service/location.service'
import { usePaymentMethods } from '@/service/payment-methods.service'
import { BookOpenIcon, Loader2, MapPinIcon, ShoppingCartIcon, UserIcon } from 'lucide-react'
import { useCreateOrder } from './hooks/useCreateOrder'

export function CreateOrderView() {
  const {
    form,
    isSubmitting,
    cityId,
    countyId,
    districtId,
    handleCityChange,
    handleCountyChange,
    handleDistrictChange,
    handleStreetChange,
    onSubmit
  } = useCreateOrder()

  // Ödeme Tipi
  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } = usePaymentMethods()
  const paymentMethodOptions = paymentMethods?.map(paymentMethod => ({
    value: paymentMethod.key,
    label: paymentMethod.name
  }))

  // Şehir
  const { data: provinces, isLoading: isLoadingProvinces } = useQueryProvinces()
  const provinceOptions = provinces?.map(province => ({ value: province.il_id.toString(), label: province.il_adi }))

  // İlçe
  const { data: counties, isLoading: isLoadingCounties } = useQueryCounties(Number(cityId), !!cityId)
  const countyOptions = counties?.map(county => ({ value: county.ilce_id.toString(), label: county.ilce_adi }))

  // Mahalle
  const { data: districts, isLoading: isLoadingDistricts } = useQueryDistricts(Number(countyId), !!countyId)
  const districtOptions = districts?.map(district => ({
    value: district.mahalle_id.toString(),
    label: district.mahalle_adi
  }))

  // Sokak
  const { data: streets, isLoading: isLoadingStreets } = useQueryStreets(Number(districtId), !!districtId)
  const streetOptions = streets?.map(street => ({ value: street.sokak_id.toString(), label: street.sokak_adi }))

  return (
    <div className='flex flex-col gap-6 pt-6 pb-16! max-sm:p-0'>
      <PageHeader title='Yeni Sipariş Oluştur' icon={ShoppingCartIcon} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {/* Müşteri ve Sipariş Bilgileri - Yan Yana */}
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Müşteri Bilgileri */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <UserIcon className='size-4.5' /> Müşteri Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className='grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-2'>
                <FormInputField
                  name='firstName'
                  autoFocus
                  required
                  control={form.control}
                  label='Ad'
                  placeholder='Ahmet'
                />
                <FormInputField name='lastName' required control={form.control} label='Soyad' placeholder='Yılmaz' />
                <FormInputField
                  name='customerPhone'
                  required
                  control={form.control}
                  label='Telefon'
                  placeholder='555 123 45 67'
                />
                <FormInputField
                  name='extensionPhone'
                  control={form.control}
                  label='Dahili Telefon'
                  placeholder='1234'
                />
              </CardContent>
            </Card>

            {/* Sipariş Bilgileri */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <BookOpenIcon className='size-4.5' /> Sipariş Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className='grid grid-cols-2 gap-x-4 gap-y-2'>
                <FormInputField
                  name='preparationTime'
                  required
                  control={form.control}
                  label='Hazırlık Süresi (dk)'
                  type='number'
                  placeholder='30'
                />
                <FormInputField
                  name='totalAmount'
                  required
                  control={form.control}
                  label='Toplam Tutar (₺)'
                  type='number'
                  placeholder='0.00'
                />
                {isLoadingPaymentMethods ? (
                  <div className='flex items-center justify-center'>
                    <Loader2 className='size-4 animate-spin' />
                  </div>
                ) : paymentMethodOptions ? (
                  <FormSelectField
                    name='paymentTypeSId'
                    control={form.control}
                    label='Ödeme Tipi'
                    formItemClassName='max-sm:col-span-2'
                    placeholder='Ödeme tipi seçiniz'
                    options={paymentMethodOptions}
                    disabled={isLoadingPaymentMethods}
                  />
                ) : null}
                <div className='max-xs:flex-col flex gap-x-4 gap-y-2 self-center justify-self-center text-nowrap max-sm:col-span-2 md:flex-col'>
                  <FormSwitchField name='contactlessDelivery' control={form.control} label='Temassız teslimat' />
                  <FormSwitchField name='ringDoorBell' control={form.control} label='Kapı zilini çal' />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Adres Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <MapPinIcon className='size-4.5' /> Adres Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='relative grid grid-cols-2 gap-x-4 gap-y-2 lg:grid-cols-3 xl:grid-cols-5'>
                <FormCommandSelectField
                  name='city.id'
                  required
                  control={form.control}
                  label='Şehir'
                  formItemClassName='max-sm:col-span-2'
                  placeholder='Şehir seçin'
                  options={provinceOptions || []}
                  isLoading={isLoadingProvinces}
                  onValueChange={cityId => handleCityChange(cityId, provinces)}
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
                  onValueChange={countyId => handleCountyChange(countyId, counties)}
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
                  onValueChange={districtId => handleDistrictChange(districtId, districts)}
                />

                <FormCommandSelectField
                  name='street.id'
                  required
                  control={form.control}
                  label='Sokak'
                  formItemClassName='max-sm:col-span-2'
                  placeholder='Sokak seçin'
                  options={streetOptions || []}
                  isLoading={isLoadingStreets}
                  disabled={!districtId}
                  onValueChange={streetId => handleStreetChange(streetId, streets)}
                />

                <FormInputField
                  name='buildingName'
                  control={form.control}
                  formItemClassName='col-span-2'
                  label='Bina Adı'
                  placeholder='Plaza Adı'
                />
                <FormInputField
                  name='buildingNumber'
                  required
                  control={form.control}
                  label='Bina No'
                  placeholder='123'
                />
                <FormInputField name='floor' control={form.control} label='Kat' placeholder='3' />

                <FormInputField name='doorNumber' required control={form.control} label='Daire No' placeholder='12' />
                <FormInputField name='postalCode' control={form.control} label='Posta Kodu' placeholder='34710' />
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormTextareaField
                  name='fullAddress'
                  required
                  control={form.control}
                  label='Tam Adres'
                  placeholder='Caferağa Mahallesi, Atatürk Caddesi No:123 Daire:12, Kadıköy/İstanbul'
                  rows={3}
                />

                <FormTextareaField
                  name='addressDirection'
                  control={form.control}
                  label='Adres Tarifi'
                  placeholder='Apartman kapısı mavi renkte, zil 3. katta...'
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Butonları */}
          <div className='flex items-center justify-end'>
            <Button
              type='submit'
              disabled={isSubmitting}
              color='success'
              size='sm'
              className='min-w-[120px] max-sm:w-full'
            >
              {isSubmitting ? 'Oluşturuluyor...' : 'Siparişi Oluştur'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
