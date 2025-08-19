'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Building2, Check, Edit, Map, MapPin } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

interface WorkingArea {
  id: string
  name: string
  type: 'polygon' | 'neighborhood'
  coordinates?: number[][]
  neighborhoods?: string[]
  isActive: boolean
}

interface WorkingAreaSettingsCardProps {
  workingAreas: WorkingArea[]
  onWorkingAreaUpdate: (id: string, data: Partial<WorkingArea>) => void
  onWorkingAreaAdd: (area: WorkingArea) => void
}

// Form validation schema
const workingAreaSchema = z.object({
  name: z.string().min(1, 'Alan adı gereklidir'),
  isActive: z.boolean().default(true)
})

type WorkingAreaFormData = z.infer<typeof workingAreaSchema>

const steps = [
  { id: 0, title: 'Alan Tipi', description: 'Poligon veya Mahalle' },
  { id: 1, title: 'Alan Tanımı', description: 'Koordinat veya mahalle seçimi' },
  { id: 2, title: 'Ayarlar', description: 'İsim ve durum' }
]

export default function WorkingAreaSettingsCard({
  workingAreas,
  onWorkingAreaUpdate,
  onWorkingAreaAdd
}: WorkingAreaSettingsCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedWorkingArea, setSelectedWorkingArea] = useState<WorkingArea | null>(null)
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([])

  const form = useForm<WorkingAreaFormData>({
    resolver: zodResolver(workingAreaSchema),
    defaultValues: {
      name: '',
      isActive: true
    }
  })

  const handleWorkingAreaEdit = () => {
    setModalOpen(true)
    setCurrentStep(0)
    setSelectedWorkingArea(null)
    setSelectedNeighborhoods([])
  }

  const handleFormSubmit = (values: WorkingAreaFormData) => {
    if (selectedWorkingArea) {
      const newArea = {
        ...selectedWorkingArea,
        id: Date.now().toString(),
        name: values.name,
        isActive: values.isActive
      }
      onWorkingAreaAdd(newArea)
      setModalOpen(false)
      setCurrentStep(0)
      setSelectedWorkingArea(null)
      setSelectedNeighborhoods([])
      form.reset()
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setCurrentStep(0)
    setSelectedWorkingArea(null)
    setSelectedNeighborhoods([])
    form.reset()
  }

  const handleNeighborhoodSelection = (neighborhood: string) => {
    setSelectedNeighborhoods(prev =>
      prev.includes(neighborhood) ? prev.filter(n => n !== neighborhood) : [...prev, neighborhood]
    )
  }

  return (
    <>
      <Card className='h-[320px]'>
        <CardHeader className='flex flex-row items-center justify-between gap-2 space-y-0 pb-2'>
          <CardTitle className='flex items-center gap-2 max-sm:text-base'>
            <MapPin className='h-5 w-5 text-orange-600' />
            Çalışma Alanı Ayarları
          </CardTitle>
          <Button className='flex items-center gap-2' variant='outline' onClick={handleWorkingAreaEdit}>
            <Edit className='h-4 w-4' />
            <span className='max-sm:hidden'>Düzenle</span>
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className='h-[200px]'>
            <div className='space-y-3'>
              {workingAreas.map(area => (
                <div key={area.id} className='rounded-lg border p-3'>
                  <div className='mb-2 flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>{area.name}</p>
                      <Badge variant='outline' color={area.type === 'polygon' ? 'info' : 'success'} className='text-xs'>
                        {area.type === 'polygon' ? 'Poligon' : 'Mahalle'}
                      </Badge>
                    </div>
                    <Switch
                      checked={area.isActive}
                      onCheckedChange={checked => onWorkingAreaUpdate(area.id, { isActive: checked })}
                    />
                  </div>
                  {area.neighborhoods && (
                    <p className='text-muted-foreground text-xs'>
                      {area.neighborhoods.slice(0, 3).join(', ')}
                      {area.neighborhoods.length > 3 && ` +${area.neighborhoods.length - 3} daha`}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Working Area Management Modal */}
      <Dialog open={modalOpen} onOpenChange={handleModalClose}>
        <DialogContent size='2xl'>
          <DialogHeader className='mb-2'>
            <DialogTitle>Çalışma Alanı Yönetimi</DialogTitle>
          </DialogHeader>

          {/* Step Indicator */}
          <div className='mb-6'>
            <div className='flex items-center justify-center space-x-4'>
              {steps.map((step, index) => (
                <div key={step.id} className='flex items-center'>
                  <div className='flex gap-2'>
                    <div
                      className={cn(
                        'bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium',
                        { 'bg-primary text-primary-foreground': currentStep === step.id },
                        { 'bg-success text-muted-foreground': currentStep > step.id }
                      )}
                    >
                      {currentStep > step.id ? (
                        <Check className='text-success-foreground size-5 font-bold' />
                      ) : (
                        <span>{step.id + 1}</span>
                      )}
                    </div>
                    <div className='flex flex-col gap-1'>
                      <p className='text-xs font-medium'>{step.title}</p>
                      <p className='text-muted-foreground text-xs'>{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && <div className='bg-muted mx-4 h-1 w-8'></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Area Type Selection */}
          {currentStep === 0 && (
            <div className='text-center'>
              <h3 className='mb-6 text-lg font-semibold'>Çalışma Alanı Tipi Seçin</h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <Card
                  className={cn('cursor-pointer transition-shadow hover:shadow-md', {
                    'bg-primary/10': selectedWorkingArea?.type === 'polygon'
                  })}
                  onClick={() => {
                    setSelectedWorkingArea({
                      id: '',
                      name: '',
                      type: 'polygon',
                      coordinates: [],
                      isActive: true
                    })
                    setCurrentStep(1)
                  }}
                >
                  <CardContent className='px-2 py-4 text-center'>
                    <Map className='mx-auto mb-4 h-12 w-12 text-blue-600' />
                    <h4 className='mb-2 font-medium'>Poligon Çizimi</h4>
                    <p className='text-muted-foreground text-sm'>Harita üzerinde manuel olarak alan çizin</p>
                  </CardContent>
                </Card>
                <Card
                  className={cn('cursor-pointer transition-shadow hover:shadow-md', {
                    'bg-primary/10': selectedWorkingArea?.type === 'neighborhood'
                  })}
                  onClick={() => {
                    setSelectedWorkingArea({
                      id: '',
                      name: '',
                      type: 'neighborhood',
                      neighborhoods: [],
                      isActive: true
                    })
                    setCurrentStep(1)
                  }}
                >
                  <CardContent className='px-2 py-4 text-center'>
                    <Building2 className='mx-auto mb-4 h-12 w-12 text-green-600' />
                    <h4 className='mb-2 font-medium'>Mahalle Seçimi</h4>
                    <p className='text-muted-foreground text-sm'>Hazır mahalle listesinden seçim yapın</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 2: Area Definition */}
          {currentStep === 1 && selectedWorkingArea && (
            <div className='space-y-4'>
              {selectedWorkingArea.type === 'polygon' ? (
                <>
                  <div className='text-center'>
                    <h3 className='mb-2 text-lg font-semibold'>Harita Üzerinde Alan Çizin</h3>
                  </div>

                  <div className='border-muted bg-muted/50 rounded-lg border-2 border-dashed p-8 text-center'>
                    <Map className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                    <p className='text-muted-foreground mb-4'>Harita entegrasyonu yakında aktif olacak</p>
                    <Button onClick={() => setCurrentStep(2)}>Demo Alan Ekle</Button>
                  </div>
                </>
              ) : (
                <div>
                  <h4 className='mb-4 font-medium'>Mahalle Seçimi</h4>
                  <div className='grid grid-cols-2 gap-2'>
                    {[
                      'Acıbadem',
                      'Caferağa',
                      'Caddebostan',
                      'Erenköy',
                      'Fenerbahçe',
                      'Göztepe',
                      'Kozyatağı',
                      'Sahrayıcedit'
                    ].map(neighborhood => (
                      <div key={neighborhood} className='flex items-center space-x-2'>
                        <Checkbox
                          id={neighborhood}
                          checked={selectedNeighborhoods.includes(neighborhood)}
                          onCheckedChange={() => handleNeighborhoodSelection(neighborhood)}
                        />
                        <label htmlFor={neighborhood} className='cursor-pointer text-sm'>
                          {neighborhood}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className='flex justify-between pt-4'>
                <Button type='button' variant='outline' onClick={() => setCurrentStep(0)}>
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Geri
                </Button>
                <Button
                  onClick={() => {
                    if (selectedWorkingArea.type === 'neighborhood') {
                      setSelectedWorkingArea(prev =>
                        prev
                          ? {
                              ...prev,
                              neighborhoods: selectedNeighborhoods
                            }
                          : null
                      )
                    }
                    setCurrentStep(2)
                  }}
                  disabled={selectedWorkingArea.type === 'neighborhood' && selectedNeighborhoods.length === 0}
                >
                  İleri
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Settings */}
          {currentStep === 2 && selectedWorkingArea && (
            <div className='space-y-6'>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alan Adı</FormLabel>
                        <FormControl>
                          <Input placeholder='Örn: Kadıköy Merkez' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='isActive'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>Bu alanı aktif et</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Alert variant='outline' color='info'>
                    <AlertDescription>
                      <strong>Özet:</strong> {selectedWorkingArea.type === 'polygon' ? 'Poligon' : 'Mahalle'} tipi alan
                      oluşturulacak.
                      {selectedWorkingArea.type === 'neighborhood' &&
                        selectedWorkingArea.neighborhoods &&
                        ` Seçilen mahalleler: ${selectedWorkingArea.neighborhoods.join(', ')}`}
                    </AlertDescription>
                  </Alert>

                  <div className='flex justify-between'>
                    <Button type='button' variant='outline' onClick={() => setCurrentStep(1)}>
                      <ArrowLeft className='mr-2 h-4 w-4' />
                      Geri
                    </Button>
                    <Button type='submit'>
                      Kaydet
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
