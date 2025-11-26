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
import { addressData } from '@/modules/citiesData'
import { BookOpenIcon, MapPinIcon, ShoppingCartIcon, UserIcon } from 'lucide-react'
import { paymentMethods } from './constants'
import { useCreateOrder } from './hooks/useCreateOrder'

export function CreateOrderView() {
  const {
    form,
    isSubmitting,
    selectedCity,
    selectedDistrict,
    availableDistricts,
    availableNeighborhoods,
    handleCityChange,
    handleDistrictChange,
    onSubmit
  } = useCreateOrder()

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
              <CardContent className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
              <CardContent className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormInputField
                  name='preparationTime'
                  required
                  control={form.control}
                  label='Hazırlık Süresi (dakika)'
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
                <FormSelectField
                  name='paymentTypeSId'
                  control={form.control}
                  label='Ödeme Tipi'
                  placeholder='Ödeme tipi seçiniz'
                  options={paymentMethods}
                />
                <div className='flex gap-4 self-center justify-self-center text-nowrap md:flex-col'>
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
              <div className='relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
                <FormCommandSelectField
                  name='city'
                  required
                  control={form.control}
                  label='Şehir'
                  placeholder='Şehir seçin'
                  options={addressData.cities.map(city => ({ value: city, label: city }))}
                  onValueChange={handleCityChange}
                />
                <FormCommandSelectField
                  name='county'
                  required
                  control={form.control}
                  label='İlçe'
                  placeholder='İlçe seçin'
                  options={availableDistricts.map(district => ({ value: district, label: district }))}
                  disabled={!selectedCity}
                  onValueChange={handleDistrictChange}
                />
                <FormCommandSelectField
                  name='neighborhood'
                  required
                  control={form.control}
                  label='Mahalle'
                  placeholder='Mahalle seçin'
                  options={availableNeighborhoods.map(neighborhood => ({
                    value: neighborhood,
                    label: neighborhood
                  }))}
                  disabled={!selectedDistrict}
                />

                <FormInputField
                  name='street'
                  required
                  control={form.control}
                  label='Sokak'
                  placeholder='Atatürk Caddesi'
                />
                <FormInputField
                  name='buildingNumber'
                  required
                  control={form.control}
                  label='Bina No'
                  placeholder='123'
                />
                <FormInputField name='floor' control={form.control} label='Kat' placeholder='3' />

                <FormInputField name='buildingName' control={form.control} label='Bina Adı' placeholder='Plaza Adı' />
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
          <div className='flex items-center justify-end border-t pt-6'>
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
