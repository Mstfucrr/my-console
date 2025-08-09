'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Restaurant } from '@/modules/orders/types'
import { AlertTriangle, BarChart3, CheckCircle2, Clock, MapPin, Phone, StoreIcon as Shop, XCircle } from 'lucide-react'

export function RestaurantDetailDialog({
  restaurant,
  open,
  onClose
}: {
  restaurant: Restaurant | null
  open: boolean
  onClose: () => void
}) {
  if (!restaurant) return null

  const statusBadge = restaurant.isActive ? (
    <Badge color='success' variant='outline' className='gap-1 text-xs'>
      <CheckCircle2 className='h-3.5 w-3.5' />
      Aktif
    </Badge>
  ) : (
    <Badge color='secondary' variant='outline' className='gap-1 text-xs'>
      <XCircle className='h-3.5 w-3.5' />
      Pasif
    </Badge>
  )

  // Mock performance data
  const performance = {
    todayOrders: 24,
    monthlyOrders: 456,
    avgDeliveryTime: 28,
    customerRating: 4.6
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent size='4xl'>
        <DialogHeader>
          <div className='flex items-center gap-3'>
            <Shop className='h-5 w-5 text-amber-400' />
            <div>
              <DialogTitle>Restoran Detayları</DialogTitle>
              <DialogDescription>{restaurant.name}</DialogDescription>
            </div>
            {statusBadge}
          </div>
        </DialogHeader>

        <ScrollArea className='max-h-[70vh]'>
          <div className='space-y-4'>
            {!restaurant.isActive && (
              <div className='border-warning bg-warning/10 text-warning flex items-center gap-2 rounded-md border p-3 text-sm'>
                <AlertTriangle className='h-4 w-4' />
                Bu restoran şu anda hizmet vermiyor. Sipariş almak için restoranı aktif duruma getirmeniz gerekir.
              </div>
            )}

            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              {/* Left: Basic, Contact, Operational */}
              <div className='space-y-4'>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-base'>Temel Bilgiler</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-2 text-sm'>
                    <div className='flex items-center justify-between'>
                      <div className='text-muted-foreground'>Restoran Adı</div>
                      <div className='font-medium'>{restaurant.name}</div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='text-muted-foreground'>Durum</div>
                      <div>{statusBadge}</div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='text-muted-foreground'>Kayıt Tarihi</div>
                      <div className='font-medium'>
                        {new Date(restaurant.createdAt).toLocaleString('tr-TR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='text-muted-foreground'>Restoran ID</div>
                      <div className='bg-muted rounded px-2 py-0.5 text-xs'>{restaurant.id}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='text-base'>İletişim Bilgileri</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3 text-sm'>
                    <div className='flex items-start gap-2'>
                      <MapPin className='text-muted-foreground mt-0.5 h-4 w-4' />
                      <div>
                        <div className='font-medium'>Adres</div>
                        <div className='text-muted-foreground'>{restaurant.address}</div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Phone className='text-muted-foreground h-4 w-4' />
                      <div>
                        <div className='font-medium'>Telefon</div>
                        <div className='text-muted-foreground'>{restaurant.phone}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='text-base'>Operasyonel Bilgiler</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3 p-0 text-sm'>
                    <div className='p-6'>
                      <div className='font-medium'>Çalışma Saatleri</div>
                      <div className='text-muted-foreground'>09:00 - 23:00 (Pazartesi - Pazar)</div>
                      <div className='text-muted-foreground text-xs'>* Bu bilgiler manuel olarak güncellenmelidir</div>
                    </div>
                    <div className='border-default-200 my-1 border-t' />
                    <div className='p-6'>
                      <div className='font-medium'>Teslimat Bölgesi</div>
                      <div className='text-muted-foreground'>5 km çapında</div>
                      <div className='text-muted-foreground text-xs'>* Detaylı bölge ayarları yakında eklenecek</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right: Performance, Integration, Quick Actions */}
              <div className='space-y-4'>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-base'>Performans İstatistikleri</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-2 gap-3 text-sm'>
                      <div className='rounded-md border p-3'>
                        <div className='text-muted-foreground mb-1 text-xs'>Bugünkü Siparişler</div>
                        <div className='flex items-center gap-2 text-lg font-semibold'>
                          <BarChart3 className='h-4 w-4 text-green-600' />
                          {performance.todayOrders}
                        </div>
                      </div>
                      <div className='rounded-md border p-3'>
                        <div className='text-muted-foreground mb-1 text-xs'>Aylık Siparişler</div>
                        <div className='flex items-center gap-2 text-lg font-semibold'>
                          <BarChart3 className='h-4 w-4 text-blue-600' />
                          {performance.monthlyOrders}
                        </div>
                      </div>
                      <div className='rounded-md border p-3'>
                        <div className='text-muted-foreground mb-1 text-xs'>Ort. Teslimat</div>
                        <div className='flex items-center gap-2 text-lg font-semibold'>
                          <Clock className='h-4 w-4 text-amber-600' />
                          {performance.avgDeliveryTime} dk
                        </div>
                      </div>
                      <div className='rounded-md border p-3'>
                        <div className='text-muted-foreground mb-1 text-xs'>Müşteri Puanı</div>
                        <div className='text-lg font-semibold'>⭐ {performance.customerRating.toFixed(1)}</div>
                      </div>
                    </div>
                    <div className='border-warning bg-warning/10 text-warning mt-3 rounded-md border px-3 py-2 text-xs'>
                      💡 Bu veriler örnek verilerdir. Gerçek performans metrikleri yakında eklenecektir.
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='text-base'>Sistem Entegrasyonu</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-2 text-sm'>
                    <div className='flex items-center justify-between'>
                      <div>API Bağlantısı</div>
                      <Badge color='success' className='gap-1'>
                        <CheckCircle2 className='h-3.5 w-3.5' /> Aktif
                      </Badge>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div>Webhook</div>
                      <Badge color='success' className='gap-1'>
                        <CheckCircle2 className='h-3.5 w-3.5' /> Çalışıyor
                      </Badge>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div>Ödeme Sistemi</div>
                      <Badge color='success' className='gap-1'>
                        <CheckCircle2 className='h-3.5 w-3.5' /> Entegre
                      </Badge>
                    </div>
                    <div className='text-muted-foreground flex items-center justify-between text-xs'>
                      <div>Son API Çağrısı</div>
                      <div>2 dakika önce</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='text-base'>Hızlı İşlemler</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <Button className='w-full' disabled>
                      📊 Detaylı Rapor Görüntüle
                    </Button>
                    <Button className='w-full' disabled>
                      ⚙️ Restoran Ayarlarını Düzenle
                    </Button>
                    <Button className='w-full' disabled>
                      🔗 Webhook Konfigürasyonu
                    </Button>
                    <Button className='w-full' disabled>
                      📍 Teslimat Bölgesi Ayarla
                    </Button>
                    <div className='bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs'>
                      Bu özellikler gelecek sürümlerde aktif olacaktır.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className='mt-2'>
          <Button variant='outline' onClick={onClose}>
            Kapat
          </Button>
          <Button disabled>Düzenle (Yakında)</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
