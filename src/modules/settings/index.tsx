'use client'

import StatCard from '@/components/StatCard'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, CheckCircle2, CreditCard, Eye, Info, Link2, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import ApiLogsModal from './components/api-logs-modal'
import PaymentMappingModal from './components/payment-mapping-modal'
import WebhookManagementModal from './components/webhook-management-modal'
import { settingsService } from './service'

export default function SettingsView() {
  const [apiLogsVisible, setApiLogsVisible] = useState(false)
  const [webhookModalVisible, setWebhookModalVisible] = useState(false)
  const [paymentMappingVisible, setPaymentMappingVisible] = useState(false)

  const [activeWebhooks, setActiveWebhooks] = useState(0)
  const [mappingCount, setMappingCount] = useState(0)

  useEffect(() => {
    // Load small stats
    const fetchStats = async () => {
      const wh = await settingsService.getWebhooks()
      setActiveWebhooks(wh.filter(w => w.isActive).length)
      const mp = await settingsService.getMappings()
      setMappingCount(mp.length)
    }
    fetchStats()
  }, [])

  return (
    <div className='mx-auto max-w-[1200px] px-4 py-6'>
      {/* Header */}
      <Card className='mb-6'>
        <CardHeader className='flex flex-col gap-1 md:flex-row md:items-center md:justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2 text-2xl'>
              <Settings className='h-6 w-6 text-yellow-500' />
              Ayarlar
            </CardTitle>
            <CardDescription>API entegrasyonları, webhook&apos;lar ve sistem ayarlarınızı yönetin</CardDescription>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={() => setApiLogsVisible(true)}>
              <Eye className='mr-2 h-4 w-4' />
              API Loglarını İncele
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <StatCard title='API Durumu' value={1} Icon={CheckCircle2} hint='Aktif' color='text-green-600' />
        <StatCard
          title="Aktif Webhook'lar"
          value={activeWebhooks}
          Icon={Link2}
          hint='Çalışıyor'
          color='text-blue-600'
        />
        <StatCard
          title='Ödeme Eşleştirmeleri'
          value={mappingCount}
          Icon={CreditCard}
          hint='Tanımlı'
          color='text-orange-500'
        />
      </div>

      {/* Modules */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card className='h-full'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0'>
            <CardTitle className='flex items-center gap-2 text-base'>
              <span className='text-blue-600'>
                <Eye className='h-5 w-5' />
              </span>
              API Logları
            </CardTitle>
            <Button variant='ghost' size='xs' onClick={() => setApiLogsVisible(true)}>
              Görüntüle
            </Button>
          </CardHeader>
          <CardContent className='space-y-3 text-sm'>
            <p className='text-muted-foreground'>API isteklerinizi ve yanıtlarını inceleyin</p>
            <ul className='list-disc space-y-1 pl-5'>
              <li>İstek/yanıt logları</li>
              <li>Hata takibi ve debugging</li>
              <li>Performans metrikleri</li>
              <li>Detaylı filtreleme</li>
            </ul>
            <Alert color='warning' variant='outline'>
              <AlertCircle />
              <AlertTitle>Son 24 Saat</AlertTitle>
              <AlertDescription>Örnek: 3 hatalı API isteği tespit edildi</AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card className='h-full'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0'>
            <CardTitle className='flex items-center gap-2 text-base'>
              <span className='text-green-600'>
                <Link2 className='h-5 w-5' />
              </span>
              Webhook Yönetimi
            </CardTitle>
            <Button variant='ghost' size='xs' onClick={() => setWebhookModalVisible(true)}>
              Yönet
            </Button>
          </CardHeader>
          <CardContent className='space-y-3 text-sm'>
            <p className='text-muted-foreground'>Webhook URL&apos;lerinizi yönetin</p>
            <ul className='list-disc space-y-1 pl-5'>
              <li>URL yönetimi</li>
              <li>Event konfigürasyonu</li>
              <li>Test fonksiyonları (yakında)</li>
              <li>Tetikleme geçmişi</li>
            </ul>
            <Alert color='success' variant='outline'>
              <CheckCircle2 />
              <AlertTitle>2 Aktif Webhook</AlertTitle>
              <AlertDescription>Tüm webhook&apos;lar düzgün çalışıyor</AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card className='h-full'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0'>
            <CardTitle className='flex items-center gap-2 text-base'>
              <span className='text-orange-500'>
                <CreditCard className='h-5 w-5' />
              </span>
              Ödeme Eşleştirme
            </CardTitle>
            <Button variant='ghost' size='xs' onClick={() => setPaymentMappingVisible(true)}>
              Yönet
            </Button>
          </CardHeader>
          <CardContent className='space-y-3 text-sm'>
            <p className='text-muted-foreground'>Ödeme tiplerini eşleştirin</p>
            <ul className='list-disc space-y-1 pl-5'>
              <li>Ödeme tipi mapping</li>
              <li>Otomatik dönüşüm</li>
              <li>Kural yönetimi</li>
              <li>Eşleştirme listesi</li>
            </ul>
            <Alert color='info' variant='outline'>
              <Info />
              <AlertTitle>3 Eşleştirme</AlertTitle>
              <AlertDescription>Nakit, kart ve online ödeme tanımlı</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Info */}
      <Card className='mt-6'>
        <CardContent className='space-y-3 p-6'>
          <Alert color='success' variant='outline'>
            <CheckCircle2 className='!size-6' />
            <AlertTitle>Entegrasyon Modülleri Aktif</AlertTitle>
            <AlertDescription>
              <div className='mt-2'>
                <ul className='list-disc space-y-1 pl-5'>
                  <li>API Logları - İstek/yanıt takibi ve hata analizi</li>
                  <li>Webhook Yönetimi - Event konfigürasyonu ve URL yönetimi</li>
                  <li>Ödeme Eşleştirme - Otomatik ödeme tipi dönüşümü</li>
                  <li>Sistem İzleme - Gerçek zamanlı durum takibi</li>
                </ul>
                <div className='mt-3 flex flex-wrap gap-2'>
                  <Button size='sm' onClick={() => setApiLogsVisible(true)}>
                    API Loglarını İncele
                  </Button>
                  <Button size='sm' variant='outline' onClick={() => setWebhookModalVisible(true)}>
                    Webhook&apos;ları Yönet
                  </Button>
                  <Button size='sm' variant='outline' onClick={() => setPaymentMappingVisible(true)}>
                    Ödeme Eşleştirmeleri
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
          <Separator />
        </CardContent>
      </Card>

      {/* Modals */}
      <ApiLogsModal open={apiLogsVisible} onClose={() => setApiLogsVisible(false)} />
      <WebhookManagementModal open={webhookModalVisible} onClose={() => setWebhookModalVisible(false)} />
      <PaymentMappingModal open={paymentMappingVisible} onClose={() => setPaymentMappingVisible(false)} />
    </div>
  )
}
