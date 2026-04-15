'use client'

import { FormFileDropzoneField } from '@/components/form/FormFileDropzoneField'
import type { LucideIcon } from 'lucide-react'
import type { Control, FieldPath } from 'react-hook-form'
import type { WelcomeFinancialFormValues } from '../schemas/welcome-financial-schema'

const ACCEPT = 'image/jpeg,image/png,image/bmp,application/pdf'

export type WelcomeDocumentUploadItemProps = {
  label: string
  Icon: LucideIcon
  previewUrl?: string
  previewMimeType?: string
  isBusy: boolean
  disabled: boolean
  control: Control<WelcomeFinancialFormValues>
  name: FieldPath<WelcomeFinancialFormValues>
  required: boolean
  onPickFile: (file: File) => void
  onClear: () => void
  maxSize: number
}

export function WelcomeDocumentUploadItem({
  label,
  Icon,
  previewUrl,
  previewMimeType,
  isBusy,
  disabled,
  control,
  name,
  required,
  onPickFile,
  onClear,
  maxSize
}: WelcomeDocumentUploadItemProps) {
  return (
    <FormFileDropzoneField
      name={name}
      control={control}
      label={label}
      accept={ACCEPT}
      required={required}
      disabled={disabled}
      isBusy={isBusy}
      previewUrl={previewUrl}
      previewMimeType={previewMimeType}
      onFileSelect={onPickFile}
      onClear={onClear}
    >
      <>
        <Icon className='text-muted-foreground mb-2 size-10 shrink-0 opacity-80' aria-hidden />
        <p className='text-muted-foreground text-xs'>Sürükleyip bırakın veya tıklayın</p>
        <p className='text-muted-foreground text-[10px]'>Maks. {maxSize} MB · JPG, PNG, BMP, PDF</p>
      </>
    </FormFileDropzoneField>
  )
}
