'use client'

import { FormCommandSelectField } from '@/components/form/FormCommandSelectField'
import { FormInputField } from '@/components/form/FormInputField'
import { FormMaskedInputField } from '@/components/form/FormMaskedInputField'
import { FormSelectField } from '@/components/form/FormSelectField'
import { FormSwitchField } from '@/components/form/FormSwitchField'
import { FormTextareaField } from '@/components/form/FormTextareaField'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { ONLY_LETTERS_REGEX } from '@/lib/regex'
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
    onSubmit,
    paymentMethodOptionsGrouped,
    provinceOptions,
    countyOptions,
    districtOptions,
    streetOptions,
    isLoadingPaymentMethods,
    isLoadingProvinces,
    isLoadingCounties,
    isLoadingDistricts,
    isLoadingStreets
  } = useCreateOrder()

  return (
    <div className='flex flex-col gap-6 pt-6 max-sm:p-0'>
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
                  regexPattern={ONLY_LETTERS_REGEX}
                  placeholder='Ahmet'
                  tabIndex={1}
                />
                <FormInputField
                  name='lastName'
                  required
                  control={form.control}
                  label='Soyad'
                  regexPattern={ONLY_LETTERS_REGEX}
                  placeholder='Yılmaz'
                  tabIndex={2}
                />
                <FormMaskedInputField
                  mask='(000) 000-0000'
                  lazy={false}
                  type='number'
                  name='customerPhone'
                  required
                  control={form.control}
                  label='Telefon'
                  placeholder='(555) 123-4567'
                  tabIndex={3}
                  regexPattern={/^[1-8][0-9]{0,9}$/}
                  onPaste={e => {
                    e.preventDefault()
                    let val = e.clipboardData.getData('Text').replace(/\D/g, '')
                    if (val.startsWith('0')) val = val.slice(1)
                    else if (val.startsWith('90')) val = val.slice(2)
                    const input = e.target as HTMLInputElement
                    input.value = val
                    input.dispatchEvent(new Event('input', { bubbles: true }))
                  }}
                />
                <FormInputField
                  name='extensionPhone'
                  control={form.control}
                  label='Dahili Telefon'
                  placeholder='1234'
                  regexPattern={/^\d{0,10}$/}
                  type='text'
                  inputMode='numeric'
                  pattern='\d*'
                  tabIndex={4}
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
                  type='text'
                  placeholder='30'
                  inputMode='numeric'
                  pattern='[0-9]*'
                  regexPattern={/^[0-9]{0,3}$/}
                  tabIndex={5}
                />
                <FormInputField
                  name='totalAmount'
                  required
                  control={form.control}
                  label='Toplam Tutar (₺)'
                  type='text'
                  placeholder='0.00'
                  inputMode='decimal'
                  regexPattern={/^[0-9]*(\.[0-9]{0,2})?$/}
                  tabIndex={6}
                />
                {isLoadingPaymentMethods ? (
                  <div className='flex items-center justify-center'>
                    <Loader2 className='size-4 animate-spin' />
                  </div>
                ) : paymentMethodOptionsGrouped ? (
                  <FormSelectField
                    name='paymentTypeSId'
                    control={form.control}
                    label='Ödeme Tipi'
                    formItemClassName='max-sm:col-span-2'
                    placeholder='Ödeme tipi seçiniz'
                    required
                    groupedOptions={paymentMethodOptionsGrouped}
                    disabled={isLoadingPaymentMethods}
                    tabIndex={7}
                  />
                ) : null}
                <div className='max-xs:flex-col flex gap-x-4 gap-y-2 self-center justify-self-center text-nowrap max-sm:col-span-2 sm:flex-col'>
                  <FormSwitchField
                    name='contactlessDelivery'
                    control={form.control}
                    label='Temassız teslimat'
                    tabIndex={8}
                  />
                  <FormSwitchField name='dontRingDoorBell' control={form.control} label='Zili çalma' tabIndex={9} />
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
                  onValueChange={cityId => handleCityChange(cityId)}
                  tabIndex={10}
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
                  onValueChange={countyId => handleCountyChange(countyId)}
                  tabIndex={11}
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
                  onValueChange={districtId => handleDistrictChange(districtId)}
                  tabIndex={12}
                />

                <FormCommandSelectField
                  name='street'
                  required
                  control={form.control}
                  label='Sokak'
                  formItemClassName='max-sm:col-span-2'
                  placeholder='4. Sokak'
                  allowCustomValue
                  tabIndex={13}
                  options={streetOptions || []}
                  isLoading={isLoadingStreets}
                  disabled={!districtId}
                  onValueChange={streetId => handleStreetChange(streetId)}
                />

                <FormInputField
                  name='buildingName'
                  control={form.control}
                  formItemClassName='max-sm:col-span-2'
                  label='Bina Adı'
                  placeholder='Plaza Adı'
                  tabIndex={14}
                />
                <FormInputField
                  name='buildingNumber'
                  required
                  control={form.control}
                  label='Bina No'
                  placeholder='123'
                  tabIndex={15}
                />
                <FormInputField
                  name='floor'
                  control={form.control}
                  label='Kat'
                  placeholder='3'
                  type='number'
                  inputMode='numeric'
                  pattern='[0-9]*'
                  tabIndex={16}
                />

                <FormInputField
                  name='doorNumber'
                  required
                  control={form.control}
                  label='Daire No'
                  placeholder='12'
                  tabIndex={17}
                />
                <FormInputField
                  name='postalCode'
                  control={form.control}
                  label='Posta Kodu'
                  type='number'
                  inputMode='numeric'
                  regexPattern='^[0-9]{0,5}$'
                  placeholder='34710'
                  tabIndex={18}
                />
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormTextareaField
                  name='fullAddress'
                  required
                  control={form.control}
                  label='Tam Adres'
                  placeholder='Caferağa Mahallesi, Atatürk Caddesi No:123 Daire:12, Kadıköy/İstanbul'
                  rows={3}
                  tabIndex={19}
                />

                <FormTextareaField
                  name='addressDirection'
                  control={form.control}
                  label='Adres Tarifi'
                  placeholder='Apartman kapısı mavi renkte, zil 3. katta...'
                  rows={2}
                  tabIndex={20}
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
