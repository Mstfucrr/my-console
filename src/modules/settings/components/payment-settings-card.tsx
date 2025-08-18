'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { CreditCard, Edit } from 'lucide-react'

interface PaymentType {
  id: string
  name: string
  type: 'cash' | 'card' | 'online'
  isActive: boolean
  terminalId?: string
  commissionRate?: number
}

interface PaymentSettingsCardProps {
  paymentTypes: PaymentType[]
  onPaymentTypeUpdate: (id: string, data: Partial<PaymentType>) => void
}

export default function PaymentSettingsCard({ paymentTypes, onPaymentTypeUpdate }: PaymentSettingsCardProps) {
  return (
    <>
      <Card className='h-[320px]'>
        <CardHeader className='flex flex-row items-center justify-between gap-2 space-y-0 pb-2'>
          <CardTitle className='flex items-center gap-2 max-sm:text-base'>
            <CreditCard className='h-5 w-5 text-purple-600' />
            Ödeme Tipi Ayarları
          </CardTitle>
          <Button className='flex items-center gap-2' variant='outline' disabled>
            <Edit className='h-4 w-4' />
            <span className='max-sm:hidden'>Ayarla</span> (Yakında)
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className='h-[200px]'>
            <div className='space-y-3'>
              {paymentTypes.map(payment => (
                <div key={payment.id} className='flex items-center justify-between rounded-lg border p-2'>
                  <div>
                    <p className='text-sm font-medium'>{payment.name}</p>
                    {payment.terminalId && (
                      <p className='text-muted-foreground text-xs'>Terminal: {payment.terminalId}</p>
                    )}
                  </div>
                  <Switch
                    checked={payment.isActive}
                    onCheckedChange={checked => onPaymentTypeUpdate(payment.id, { isActive: checked })}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  )
}
