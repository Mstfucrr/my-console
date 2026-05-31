'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AxiosError } from 'axios'
import { FileSignature, IdCard, Landmark, Newspaper, ScanFace, type LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useBusinessSetup } from '../context/business-setup-context'
import type { BusinessInfoCompanyType, BusinessInfoDocType } from '../types'
import { BusinessInfoDocumentUploadItem } from './business-info-document-upload-item'

const MAX_SIZE = 10

const MAX_BYTES = Math.floor(MAX_SIZE * 1024 * 1024)
const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/bmp', 'application/pdf'])

type SlotField = 'taxDocumentKey' | 'idFrontKey' | 'idBackKey' | 'signatureCircularKey' | 'tradeRegistryGazetteKey'

type SlotConfig = {
  docType: BusinessInfoDocType
  label: string
  field: SlotField
  Icon: LucideIcon
  required: boolean
}

function slotsForCompanyType(companyType: BusinessInfoCompanyType): SlotConfig[] {
  const isBireysel = companyType === 'Bireysel'
  const tax: SlotConfig = {
    docType: 'taxDocument',
    label: 'Vergi levhası',
    field: 'taxDocumentKey',
    Icon: Landmark,
    required: true
  }
  const idFront: SlotConfig = {
    docType: 'idFront',
    label: 'Kimlik ön yüz',
    field: 'idFrontKey',
    Icon: ScanFace,
    required: isBireysel
  }
  const idBack: SlotConfig = {
    docType: 'idBack',
    label: 'Kimlik arka yüz',
    field: 'idBackKey',
    Icon: IdCard,
    required: isBireysel
  }
  const signature: SlotConfig = {
    docType: 'signatureCircular',
    label: 'İmza sirküsü',
    field: 'signatureCircularKey',
    Icon: FileSignature,
    required: !isBireysel
  }
  const tradeRegistry: SlotConfig = {
    docType: 'tradeRegistryGazette',
    label: 'Ticaret Sicil Gazetesi',
    field: 'tradeRegistryGazetteKey',
    Icon: Newspaper,
    required: true
  }

  if (isBireysel) return [tax, idFront, idBack, signature]

  return [tax, signature, idFront, idBack, tradeRegistry]
}

function getFileValidationError(file: File) {
  if (file.size > MAX_BYTES) return `Dosya boyutu en fazla ${MAX_SIZE} MB olmalıdır.`
  if (!ACCEPTED_TYPES.has(file.type)) return 'Yalnızca JPG, PNG, BMP veya PDF yükleyebilirsiniz.'
  return null
}

type LocalPreviewEntry = { url: string; mime: string }

function buildPreviewEntry(file: File): LocalPreviewEntry {
  return { url: URL.createObjectURL(file), mime: file.type }
}

export function BusinessInfoDocumentUploadSection() {
  const { form, uploadBusinessInfoDocument } = useBusinessSetup()
  const companyType = form.watch('companyType')
  const { control, setValue } = form
  const [localPreview, setLocalPreview] = useState<Partial<Record<BusinessInfoDocType, LocalPreviewEntry>>>({})
  const previewRef = useRef(localPreview)

  const slots = useMemo(() => slotsForCompanyType(companyType), [companyType])

  useEffect(() => {
    previewRef.current = localPreview
  }, [localPreview])

  const revokePreview = useCallback((docType: BusinessInfoDocType) => {
    setLocalPreview(prev => {
      const entry = prev[docType]
      if (entry?.url) URL.revokeObjectURL(entry.url)
      const next = { ...prev }
      delete next[docType]
      return next
    })
  }, [])

  useEffect(() => {
    return () => {
      Object.values(previewRef.current).forEach(entry => {
        if (entry?.url) URL.revokeObjectURL(entry.url)
      })
    }
  }, [])

  useEffect(() => {
    if (companyType !== 'Bireysel') return
    requestAnimationFrame(() => {
      revokePreview('signatureCircular')
      revokePreview('tradeRegistryGazette')
    })
  }, [companyType, revokePreview])

  const handleFile = async (slot: SlotConfig, file: File) => {
    const validationError = getFileValidationError(file)
    if (validationError) {
      toast.error(validationError)
      return
    }
    revokePreview(slot.docType)
    setLocalPreview(prev => ({ ...prev, [slot.docType]: buildPreviewEntry(file) }))
    try {
      const key = await uploadBusinessInfoDocument({ file, docType: slot.docType })
      setValue(slot.field, key, { shouldValidate: true, shouldDirty: true })
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      revokePreview(slot.docType)
      setValue(slot.field, '', { shouldValidate: true })
      toast.error(axiosError.response?.data?.message ?? 'Evrak yüklenirken bir hata oluştu')
    }
  }

  const handleClear = useCallback(
    (slot: SlotConfig) => {
      revokePreview(slot.docType)
      setValue(slot.field, '', { shouldValidate: true, shouldDirty: true })
    },
    [revokePreview, setValue]
  )

  return (
    <Card className='mt-5'>
      <CardHeader>
        <CardTitle className='text-base! font-medium'>Evrak Bilgileri</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-y-2'>
        <div className='grid gap-x-4 gap-y-2 sm:grid-cols-2'>
          {slots.map(slot => (
            <BusinessInfoDocumentUploadItem
              key={`${slot.docType}-${slot.label}`}
              required={slot.required}
              label={slot.label}
              Icon={slot.Icon}
              control={control}
              name={slot.field}
              previewUrl={localPreview[slot.docType]?.url}
              previewMimeType={localPreview[slot.docType]?.mime}
              isBusy={false}
              disabled={false}
              onPickFile={file => handleFile(slot, file)}
              onClear={() => handleClear(slot)}
              maxSize={MAX_SIZE}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
