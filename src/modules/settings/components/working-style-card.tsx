'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { FileText, Info, Package } from 'lucide-react'
import { useState } from 'react'

interface WorkingStyleCardProps {
  workingStyle: 'kontor' | 'unlimited'
  onWorkingStyleChange: (style: 'kontor' | 'unlimited') => void
}

export default function WorkingStyleCard({ workingStyle, onWorkingStyleChange }: WorkingStyleCardProps) {
  const [packageModalOpen, setPackageModalOpen] = useState(false)
  const [contractModalOpen, setContractModalOpen] = useState(false)

  const handleStyleChange = (style: 'kontor' | 'unlimited') => {
    onWorkingStyleChange(style)
    if (style === 'kontor') {
      setPackageModalOpen(true)
    } else {
      setContractModalOpen(true)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Info className='h-5 w-5 text-slate-600' />
            Çalışma Şekli
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <RadioGroup value={workingStyle} onValueChange={handleStyleChange}>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='kontor' id='kontor' />
              <Label htmlFor='kontor' className='flex-1 cursor-pointer'>
                <div>
                  <p className='font-medium'>Kontor Bazlı</p>
                  <p className='text-muted-foreground text-sm'>Paket satın alarak kullanım hakkı kazanın</p>
                </div>
              </Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='unlimited' id='unlimited' />
              <Label htmlFor='unlimited' className='flex-1 cursor-pointer'>
                <div>
                  <p className='font-medium'>Sınırsız Taşımacılık</p>
                  <p className='text-muted-foreground text-sm'>Sözleşme ile sınırsız kullanım hakkı</p>
                </div>
              </Label>
            </div>
          </RadioGroup>

          <Separator />

          <Button
            className='w-full'
            onClick={() => (workingStyle === 'kontor' ? setPackageModalOpen(true) : setContractModalOpen(true))}
          >
            {workingStyle === 'kontor' ? 'Paket Satın Al' : 'Sözleşme Görüntüle'}
          </Button>
        </CardContent>
      </Card>

      {/* Package Modal */}
      <Dialog open={packageModalOpen} onOpenChange={setPackageModalOpen}>
        <DialogContent size='xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Package className='h-5 w-5' />
              Kontor Paketleri
            </DialogTitle>
          </DialogHeader>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <Card className='text-center'>
              <CardContent className='p-6'>
                <h3 className='mb-2 text-xl font-bold'>100 Kontor</h3>
                <p className='mb-2 text-3xl font-bold text-yellow-600'>₺299</p>
                <p className='text-muted-foreground mb-4 text-sm'>Başlangıç paketi</p>
                <Button className='w-full'>Satın Al</Button>
              </CardContent>
            </Card>

            <Card className='border-primary text-center'>
              <CardContent className='p-6'>
                <h3 className='mb-2 text-xl font-bold'>1000 Kontor</h3>
                <p className='mb-2 text-3xl font-bold text-yellow-600'>₺2499</p>
                <p className='text-muted-foreground mb-4 text-sm'>Popüler paket</p>
                <Button className='w-full'>Satın Al</Button>
              </CardContent>
            </Card>

            <Card className='text-center'>
              <CardContent className='p-6'>
                <h3 className='mb-2 text-xl font-bold'>5000 Kontor</h3>
                <p className='mb-2 text-3xl font-bold text-yellow-600'>₺9999</p>
                <p className='text-muted-foreground mb-4 text-sm'>Büyük işletmeler</p>
                <Button className='w-full'>Satın Al</Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contract Modal */}
      <Dialog open={contractModalOpen} onOpenChange={setContractModalOpen}>
        <DialogContent size='xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              Sınırsız Taşımacılık Sözleşmesi
            </DialogTitle>
          </DialogHeader>

          <Alert>
            <Info className='h-4 w-4' />
            <AlertTitle>Sınırsız Taşımacılık</AlertTitle>
            <AlertDescription>
              Bu hizmet ile tüm teslimat işlemlerinizi kısıtlama olmadan gerçekleştirebilirsiniz.
            </AlertDescription>
          </Alert>

          <div className='bg-muted/50 max-h-96 overflow-y-auto rounded-lg border p-4'>
            <h4 className='mb-4 font-semibold'>Sözleşme Koşulları</h4>
            <div className='space-y-4 text-sm'>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                laborum.
              </p>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam
                rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                explicabo.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
