import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { IProfileFinancialDetails } from '@/types/profile'
import { ExternalLink, FileText } from 'lucide-react'

type DocRowProps = { label: string; url: string | null | undefined }

function DocRow({ label, url }: DocRowProps) {
  const href = url?.trim()
  return (
    <div className='flex items-center justify-between gap-3'>
      <span className='text-muted-foreground text-sm'>{label}</span>
      {href ? (
        <a
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          className='text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline'
        >
          Görüntüle
          <ExternalLink className='h-3.5 w-3.5 shrink-0 opacity-70' aria-hidden />
        </a>
      ) : (
        <span className='text-muted-foreground text-sm'>—</span>
      )}
    </div>
  )
}

export function AccountDocumentsCard({
  financialDetails
}: {
  financialDetails: IProfileFinancialDetails | null | undefined
}) {
  return (
    <Card className='lg:col-span-2'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-base'>
          <FileText className='h-4 w-4' />
          Evraklar
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <DocRow label='Vergi levhası' url={financialDetails?.taxDocumentUrl} />
        <Separator />
        <DocRow label='Kimlik ön yüz' url={financialDetails?.idFrontUrl} />
        <Separator />
        <DocRow label='Kimlik arka yüz' url={financialDetails?.idBackUrl} />
        <Separator />
        <DocRow label='İmza sirküsü' url={financialDetails?.signatureCircularUrl} />
      </CardContent>
    </Card>
  )
}
