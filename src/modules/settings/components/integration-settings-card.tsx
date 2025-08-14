'use client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, PiIcon as Api, Copy, Edit, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'

interface Integration {
  id: string
  name: string
  icon: string
  isActive: boolean
  webhookUrl?: string
  apiKey?: string
  orderCount: number
}

interface IntegrationSettingsCardProps {
  integrations: Integration[]
  onIntegrationUpdate: (id: string, data: Partial<Integration>) => void
}

const integrationSchema = z.object({
  webhookUrl: z.string().url('Geçerli bir URL girin'),
  apiKey: z.string().min(1, 'API Key gereklidir'),
  isActive: z.boolean()
})

export default function IntegrationSettingsCard({ integrations, onIntegrationUpdate }: IntegrationSettingsCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null)
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({})

  const form = useForm<z.infer<typeof integrationSchema>>({
    resolver: zodResolver(integrationSchema),
    defaultValues: {
      webhookUrl: '',
      apiKey: '',
      isActive: false
    }
  })

  const handleEdit = (integration: Integration) => {
    setEditingIntegration(integration)
    form.reset({
      webhookUrl: integration.webhookUrl || '',
      apiKey: integration.apiKey || '',
      isActive: integration.isActive
    })
  }

  const handleCancel = () => {
    setEditingIntegration(null)
    form.reset()
  }

  const onSubmit = (values: z.infer<typeof integrationSchema>) => {
    if (editingIntegration) {
      onIntegrationUpdate(editingIntegration.id, values)
      toast.success('Entegrasyon güncellendi')
      setEditingIntegration(null)
      form.reset()
    }
  }

  const toggleApiKeyVisibility = (id: string) => {
    setShowApiKeys(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const copyApiKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey)
    toast.success('API Key kopyalandı')
  }

  return (
    <>
      <Card className='h-[320px]'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='flex items-center gap-2'>
            <Api className='h-5 w-5 text-blue-600' />
            Entegrasyon Ayarları
          </CardTitle>
          <Button size='sm' variant='outline' onClick={() => setModalOpen(true)}>
            <Edit className='mr-2 h-4 w-4' />
            Yönet
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className='h-[200px]'>
            <div className='space-y-3'>
              {integrations.map(integration => (
                <div key={integration.id} className='flex items-center justify-between rounded-lg border p-2'>
                  <div className='flex items-center gap-3'>
                    <span className='text-xl'>{integration.icon}</span>
                    <div>
                      <p className='text-sm font-medium'>{integration.name}</p>
                      <p className='text-muted-foreground text-xs'>{integration.orderCount} sipariş</p>
                    </div>
                  </div>
                  <Switch
                    checked={integration.isActive}
                    onCheckedChange={checked => onIntegrationUpdate(integration.id, { isActive: checked })}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent size='xl'>
          <DialogHeader>
            <DialogTitle>Entegrasyon Yönetimi</DialogTitle>
          </DialogHeader>

          <Alert>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Entegrasyon Bilgisi</AlertTitle>
            <AlertDescription>
              Her entegrasyon için webhook URL&apos;nizi ve API anahtarınızı ayarlayın.
            </AlertDescription>
          </Alert>

          <ScrollArea className='max-h-[500px] pr-2'>
            <div className='space-y-4'>
              {integrations.map(integration => (
                <Card key={integration.id} className='p-4'>
                  <CardHeader className='p-0 pb-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <span className='text-lg'>{integration.icon}</span>
                        <h4 className='font-medium'>{integration.name}</h4>
                      </div>
                      {editingIntegration?.id !== integration.id && (
                        <Button variant='outline' size='xs' onClick={() => handleEdit(integration)}>
                          <Edit className='mr-2 h-4 w-4' />
                          Düzenle
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className='p-0'>
                    {editingIntegration?.id === integration.id ? (
                      // Edit Mode - Form
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                          <FormField
                            control={form.control}
                            name='webhookUrl'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Webhook URL</FormLabel>
                                <FormControl>
                                  <Input placeholder='https://api.example.com/webhook' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='apiKey'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>API Key</FormLabel>
                                <FormControl>
                                  <Input type='password' placeholder='API anahtarınızı girin' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='isActive'
                            render={({ field }) => (
                              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                                <div className='space-y-0.5'>
                                  <FormLabel>Entegrasyonu Aktif Et</FormLabel>
                                </div>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <div className='flex justify-end gap-2'>
                            <Button type='button' variant='outline' size='xs' onClick={handleCancel}>
                              Vazgeç
                            </Button>
                            <Button type='submit' size='xs'>
                              Kaydet
                            </Button>
                          </div>
                        </form>
                      </Form>
                    ) : (
                      // View Mode - Display
                      <div className='space-y-3 text-sm'>
                        <div>
                          <span className='text-muted-foreground'>Webhook URL:</span>
                          <p className='bg-muted mt-1 rounded p-2 font-mono text-xs break-all'>
                            {integration.webhookUrl || 'Ayarlanmamış'}
                          </p>
                        </div>
                        <div>
                          <span className='text-muted-foreground'>API Key:</span>
                          <div className='mt-1 flex items-center gap-2'>
                            <p className='bg-muted flex-1 rounded p-2 font-mono text-xs'>
                              {showApiKeys[integration.id]
                                ? integration.apiKey || 'Ayarlanmamış'
                                : integration.apiKey
                                  ? '••••••••••••••••'
                                  : 'Ayarlanmamış'}
                            </p>
                            {integration.apiKey && (
                              <div className='flex gap-1'>
                                <Button
                                  variant='ghost'
                                  size='icon-sm'
                                  onClick={() => toggleApiKeyVisibility(integration.id)}
                                  className='h-8 w-8 p-0'
                                >
                                  {showApiKeys[integration.id] ? (
                                    <EyeOff className='h-3 w-3' />
                                  ) : (
                                    <Eye className='h-3 w-3' />
                                  )}
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='icon-sm'
                                  onClick={() => copyApiKey(integration.apiKey!)}
                                  className='h-8 w-8 p-0'
                                >
                                  <Copy className='h-3 w-3' />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className='flex items-center justify-between pt-2'>
                          <span className='text-muted-foreground'>Durum:</span>
                          <div className='flex items-center gap-2'>
                            <span className='text-sm'>{integration.isActive ? 'Aktif' : 'Pasif'}</span>
                            <Switch
                              checked={integration.isActive}
                              onCheckedChange={checked => onIntegrationUpdate(integration.id, { isActive: checked })}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
