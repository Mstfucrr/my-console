'use client'

import { FormInputField, FormSelectField, FormSwitchField, FormTextareaField } from '@/components/form'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormLabel } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'

const orderItemSchema = z.object({
  id: z.string().min(1, 'Ürün ID zorunludur'),
  name: z.string().min(1, 'Ürün adı zorunludur'),
  quantity: z.number().min(1, 'Adet en az 1 olmalıdır'),
  price: z.number().min(0, "Fiyat 0'dan büyük olmalıdır")
})

const createOrderSchema = z.object({
  // Müşteri Bilgileri
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
  customerPhone: z.string().min(10, 'Telefon numarası en az 10 karakter olmalıdır'),
  extensionPhone: z.string().optional(),

  // Sipariş Bilgileri
  preparationTime: z
    .number()
    .min(1, 'Hazırlık süresi en az 1 dakika olmalıdır')
    .max(120, 'Hazırlık süresi en fazla 120 dakika olabilir'),
  totalAmount: z.number().min(0, "Toplam tutar 0'dan büyük olmalıdır"),

  // Adres Bilgileri
  city: z.string().min(1, 'Şehir zorunludur'),
  county: z.string().min(1, 'İlçe zorunludur'),
  neighborhood: z.string().min(1, 'Mahalle zorunludur'),
  street: z.string().min(1, 'Sokak zorunludur'),
  buildingNumber: z.string().optional(),
  floor: z.string().optional(),
  buildingName: z.string().optional(),
  doorNumber: z.string().optional(),
  postalCode: z.string().optional(),
  fullAddress: z.string().min(10, 'Tam adres en az 10 karakter olmalıdır'),
  addressDirection: z.string().optional(),

  // Ödeme ve Teslimat
  paymentTypeSId: z.string().min(1, 'Ödeme tipi seçimi zorunludur'),
  currencyCode: z.string().default('TRY'),
  contactlessDelivery: z.boolean().default(false),
  ringDoorBell: z.boolean().default(true),

  // Ürünler
  products: z.array(orderItemSchema).min(1, 'En az 1 ürün eklemelisiniz').optional()
})

type CreateOrderFormData = z.infer<typeof createOrderSchema>

interface CreateOrderModalProps {
  visible: boolean
  onClose: () => void
  onSuccess: () => void
}

const paymentMethods = [
  { value: 'cash', label: 'Nakit' },
  { value: 'card', label: 'Kredi Kartı' },
  { value: 'online', label: 'Online Ödeme' }
]

const currencies = [
  { value: 'TRY', label: 'Türk Lirası (TRY)' },
  { value: 'USD', label: 'Amerikan Doları (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' }
]

export function CreateOrderModal({ visible, onClose, onSuccess }: CreateOrderModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [calculatedTotal, setCalculatedTotal] = useState(0)

  const form = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      customerPhone: '',
      extensionPhone: '',
      preparationTime: 30,
      totalAmount: 0,
      city: '',
      county: '',
      neighborhood: '',
      street: '',
      buildingNumber: '',
      floor: '',
      buildingName: '',
      doorNumber: '',
      postalCode: '',
      fullAddress: '',
      addressDirection: '',
      paymentTypeSId: '',
      currencyCode: 'TRY',
      contactlessDelivery: false,
      ringDoorBell: true,
      products: []
    }
  })

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'products'
  })

  const watchedProducts = form.watch('products')
  const watchedTotalAmount = form.watch('totalAmount')

  // Ürünlerden toplam hesapla
  const calculateProductTotal = () => {
    if (!watchedProducts) return 0
    return watchedProducts.reduce((sum, product) => sum + product.quantity * product.price, 0)
  }

  // Toplam tutarı güncelle
  const updateCalculatedTotal = () => {
    const productTotal = calculateProductTotal()
    setCalculatedTotal(productTotal)
  }

  // Form değişikliklerini izle
  form.watch(() => {
    updateCalculatedTotal()
  })

  const addProduct = () => {
    append({
      id: `product_${Date.now()}`,
      name: '',
      quantity: 1,
      price: 0
    })
  }

  const updateQuantity = (index: number, increment: boolean) => {
    const product = watchedProducts?.[index]
    if (!product) return

    const newQuantity = increment ? product.quantity + 1 : Math.max(1, product.quantity - 1)
    update(index, { ...product, quantity: newQuantity })
  }

  const onSubmit = async (data: CreateOrderFormData) => {
    setIsSubmitting(true)
    try {
      // Create order object according to the required JSON structure
      const orderData = {
        orderId: `ORD-${Date.now()}`,
        storeId: 'store_001',
        salesChannelSId: 'portal',
        isTestOrder: false,
        restaurantSId: 'rest_001',
        paymentMethod: data.paymentTypeSId,
        integration: 'manuel',
        preparationTime: data.preparationTime,
        products: data.products || [],
        customer: {
          firstName: data.firstName,
          lastName: data.lastName,
          customerPhone: data.customerPhone,
          extensionPhone: data.extensionPhone || undefined
        },
        address: {
          city: data.city,
          county: data.county,
          neighborhood: data.neighborhood,
          street: data.street,
          buildingName: data.buildingName || undefined,
          buildingNumber: data.buildingNumber || undefined,
          floor: data.floor || undefined,
          doorNumber: data.doorNumber || undefined,
          addressDirection: data.addressDirection || undefined,
          fullAddress: data.fullAddress,
          countryCode: 'TR',
          postalCode: data.postalCode || undefined
        },
        payment: {
          paymentTypeSId: data.paymentTypeSId,
          currencyCode: data.currencyCode,
          totalPrice: data.totalAmount || calculatedTotal
        },
        delivery: {
          contactlessDelivery: data.contactlessDelivery,
          ringDoorBell: data.ringDoorBell,
          category: 'standard',
          type: 'delivery'
        }
      }

      console.log('Creating order:', orderData)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      toast.success('Sipariş başarıyla oluşturuldu!')
      onSuccess()
      onClose()
      form.reset()
      setCalculatedTotal(0)
    } catch (error) {
      toast.error('Sipariş oluşturulurken bir hata oluştu.')
      console.error('Error creating order:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    form.reset()
    setCalculatedTotal(0)
    onClose()
  }

  const isUsingManualTotal = watchedTotalAmount > 0
  const displayTotal = isUsingManualTotal ? watchedTotalAmount : calculatedTotal

  return (
    <AlertDialog open={visible} onOpenChange={handleClose}>
      <AlertDialogContent className='p-1' size='4xl'>
        <AlertDialogHeader className='p-6 pb-0'>
          <AlertDialogTitle className='flex items-center gap-2'>
            <ShoppingCart className='h-5 w-5' />
            Yeni Sipariş Oluştur
          </AlertDialogTitle>
        </AlertDialogHeader>

        <ScrollArea className='max-h-[80vh] p-6 pt-0'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {/* Müşteri ve Sipariş Bilgileri - Yan Yana */}
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                {/* Müşteri Bilgileri */}
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-lg'>👤 Müşteri Bilgileri</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      <FormInputField name='firstName' control={form.control} label='Ad' placeholder='Ahmet' />
                      <FormInputField name='lastName' control={form.control} label='Soyad' placeholder='Yılmaz' />
                    </div>
                    <FormInputField
                      name='customerPhone'
                      control={form.control}
                      label='Telefon'
                      placeholder='+90 555 123 45 67'
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
                    <CardTitle className='flex items-center gap-2 text-lg'>📋 Sipariş Bilgileri</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <FormInputField
                      name='preparationTime'
                      control={form.control}
                      label='Hazırlık Süresi (dakika)'
                      type='number'
                      placeholder='30'
                    />
                    <FormInputField
                      name='totalAmount'
                      control={form.control}
                      label='Toplam Tutar (₺)'
                      type='number'
                      placeholder='0.00'
                    />
                    <div className='bg-muted rounded-lg p-3'>
                      <p className='text-muted-foreground text-xs'>
                        💡 İpucu: Ürün eklemek yerine direkt toplam tutarı girebilirsiniz
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Adres Bilgileri */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-lg'>🏠 Adres Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                    <FormInputField name='city' control={form.control} label='Şehir' placeholder='İstanbul' />
                    <FormInputField name='county' control={form.control} label='İlçe' placeholder='Kadıköy' />
                    <FormInputField
                      name='neighborhood'
                      control={form.control}
                      label='Mahalle'
                      placeholder='Caferağa Mahallesi'
                    />
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                    <FormInputField name='street' control={form.control} label='Sokak' placeholder='Atatürk Caddesi' />
                    <FormInputField name='buildingNumber' control={form.control} label='Bina No' placeholder='123' />
                    <FormInputField name='floor' control={form.control} label='Kat' placeholder='3' />
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                    <FormInputField
                      name='buildingName'
                      control={form.control}
                      label='Bina Adı'
                      placeholder='Plaza Adı'
                    />
                    <FormInputField name='doorNumber' control={form.control} label='Daire No' placeholder='12' />
                    <FormInputField name='postalCode' control={form.control} label='Posta Kodu' placeholder='34710' />
                  </div>

                  <FormTextareaField
                    name='fullAddress'
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
                </CardContent>
              </Card>

              {/* Ürünler */}
              <Card>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='flex items-center gap-2 text-lg'>🛒 Ürünler</CardTitle>
                    <Button type='button' onClick={addProduct} size='sm' variant='outline'>
                      <Plus className='mr-1 h-4 w-4' />
                      Ürün Ekle
                    </Button>
                  </div>
                </CardHeader>
                {fields.length > 0 && (
                  <CardContent className='space-y-4'>
                    {fields.map((field, index) => (
                      <div key={field.id} className='space-y-3 rounded-lg border p-4'>
                        <div className='flex items-center justify-between'>
                          <span className='font-medium'>Ürün {index + 1}</span>
                          <Button
                            type='button'
                            onClick={() => remove(index)}
                            size='sm'
                            variant='ghost'
                            className='text-red-500 hover:text-red-700'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>

                        <div className='grid grid-cols-1 gap-3 md:grid-cols-4'>
                          <FormInputField
                            name={`products.${index}.name`}
                            control={form.control}
                            label='Ürün Adı'
                            placeholder='Pizza Margherita'
                          />
                          <FormInputField
                            name={`products.${index}.price`}
                            control={form.control}
                            label='Fiyat (₺)'
                            type='number'
                            placeholder='45.00'
                          />
                          <div className='flex items-center gap-2'>
                            <FormLabel>Adet:</FormLabel>
                            <Button
                              type='button'
                              onClick={() => updateQuantity(index, false)}
                              size='icon-xs'
                              variant='outline'
                            >
                              <Minus className='h-3 w-3' />
                            </Button>
                            <span className='w-8 text-center'>{watchedProducts?.[index]?.quantity || 1}</span>
                            <Button
                              type='button'
                              onClick={() => updateQuantity(index, true)}
                              size='icon-xs'
                              variant='outline'
                            >
                              <Plus className='h-3 w-3' />
                            </Button>
                          </div>
                          <FormInputField
                            name={`products.${index}.id`}
                            control={form.control}
                            label='Ürün ID'
                            placeholder='PROD_001'
                          />
                        </div>
                      </div>
                    ))}

                    {fields.length > 0 && (
                      <>
                        <Separator />
                        <div className='flex items-center justify-between rounded-lg bg-green-50 p-3'>
                          <span className='font-semibold'>Hesaplanan Toplam:</span>
                          <Badge variant='soft' className='px-3 py-1 text-lg'>
                            ₺{displayTotal?.toFixed(2)}
                          </Badge>
                        </div>
                        <p className='text-muted-foreground text-center text-xs'>
                          {isUsingManualTotal ? '✅ Manuel tutar kullanılıyor' : '🧮 Ürünlerden hesaplanan tutar'}
                        </p>
                      </>
                    )}
                  </CardContent>
                )}
              </Card>

              {/* Ödeme ve Teslimat Bilgileri */}
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                {/* Ödeme Bilgileri */}
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-lg'>💳 Ödeme Bilgileri</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <FormSelectField
                      name='paymentTypeSId'
                      control={form.control}
                      label='Ödeme Tipi'
                      placeholder='Ödeme tipi seçiniz'
                      options={paymentMethods}
                    />

                    <FormSelectField
                      name='currencyCode'
                      control={form.control}
                      label='Para Birimi'
                      placeholder='Para birimi seçiniz'
                      options={currencies}
                    />
                  </CardContent>
                </Card>

                {/* Teslimat Bilgileri */}
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-lg'>🚚 Teslimat Bilgileri</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <FormSwitchField name='contactlessDelivery' control={form.control} label='Temassız teslimat' />

                    <FormSwitchField name='ringDoorBell' control={form.control} label='Kapı zilini çal' />

                    <div className='bg-muted rounded-lg p-3'>
                      <p className='text-muted-foreground text-xs'>📋 Teslimat tipi: Standart teslimat</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Form Butonları */}
              <div className='flex justify-end gap-3'>
                <Button type='button' variant='outline' onClick={handleClose}>
                  İptal
                </Button>
                <Button type='submit' disabled={isSubmitting} className='min-w-[120px]'>
                  {isSubmitting ? 'Oluşturuluyor...' : 'Siparişi Oluştur'}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </AlertDialogContent>
    </AlertDialog>
  )
}
