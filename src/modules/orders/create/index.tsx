'use client'

import { FormCommandSelectField } from '@/components/form/FormCommandSelectField'
import { FormCurrencyInputField } from '@/components/form/FormCurrencyInputField'
import { FormInputField } from '@/components/form/FormInputField'
import { FormMaskedInputField } from '@/components/form/FormMaskedInputField'
import { FormSelectField } from '@/components/form/FormSelectField'
import { FormSwitchField } from '@/components/form/FormSwitchField'
import { FormTextareaField } from '@/components/form/FormTextareaField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { ONLY_LETTERS_REGEX } from '@/lib/regex'
import { BookOpenIcon, Loader2, MapPinIcon, UserIcon } from 'lucide-react'
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
    <div className='flex flex-col gap-4 max-sm:p-0'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6' autoComplete='off'>
          {/* Müşteri ve Sipariş Bilgileri - Yan Yana */}
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
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
                  autoComplete='off'
                />
                <FormInputField
                  name='lastName'
                  required
                  control={form.control}
                  label='Soyad'
                  regexPattern={ONLY_LETTERS_REGEX}
                  placeholder='Yılmaz'
                  tabIndex={2}
                  autoComplete='off'
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
                  autoComplete='off'
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
                  autoComplete='off'
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
              <CardContent className='grid gap-x-4 gap-y-2 sm:grid-cols-2'>
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
                    tabIndex={6}
                  />
                ) : null}
                <FormCurrencyInputField
                  name='totalAmount'
                  required
                  control={form.control}
                  label='Toplam Tutar (₺)'
                  formItemClassName='max-sm:col-span-2'
                  pattern='[0-9,]*'
                  placeholder='1.234,56'
                  tabIndex={7}
                  // Virgülden önce max 99999, arada otomatik eklenen noktalar olabilir, en fazla 9 karakter, virgülden sonra max 2 hane
                  regexPattern={/^((\d{1,2}|\d{1,2}\.\d{3}|[1-9]{1}\d{0,4}))(,\d{0,2})?$/}
                  autoComplete='off'
                />
                <FormSwitchField
                  formItemClassName='max-sm:mt-5 lg:mt-5'
                  name='contactlessDelivery'
                  control={form.control}
                  label='Temassız teslimat'
                  tabIndex={8}
                />
                <FormSwitchField
                  formItemClassName='max-sm:mt-5 lg:mt-5'
                  name='dontRingDoorBell'
                  control={form.control}
                  label='Zili çalma'
                  tabIndex={9}
                />
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
              <div className='relative grid grid-cols-2 gap-x-4 gap-y-2 lg:grid-cols-3 xl:grid-cols-4'>
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
                  placeholder='Yıldız Apartmanı'
                  tabIndex={14}
                  autoComplete='off'
                />
                <FormInputField
                  name='buildingNumber'
                  required
                  control={form.control}
                  label='Bina No'
                  placeholder='123'
                  tabIndex={15}
                  regexPattern={/^[a-zA-Z0-9\s]{0,5}$/}
                  autoComplete='off'
                />
                <FormInputField
                  name='floor'
                  control={form.control}
                  label='Kat'
                  placeholder='3'
                  type='text'
                  inputMode='numeric'
                  pattern='[0-9]*'
                  regexPattern={/^[0-9]{0,3}$/}
                  tabIndex={16}
                  autoComplete='off'
                />

                <FormInputField
                  name='doorNumber'
                  required
                  control={form.control}
                  label='Daire No'
                  placeholder='12'
                  tabIndex={17}
                  regexPattern={/^[a-zA-Z0-9\s]{0,5}$/}
                  autoComplete='off'
                />
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormTextareaField
                  name='fullAddress'
                  control={form.control}
                  label='Tam Adres'
                  className='resize-none'
                  disabled
                  readOnly
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
                  autoComplete='off'
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
              tabIndex={21}
              size='sm'
              data-testid='create-order-submit-button'
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
