import { TooltippedElement } from '@/components/tooltipped-element'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { FileDropzoneBusyOverlay, FileDropzonePreviewContent } from './FormFileDropzonePreviews'

export type FormFileDropzoneFieldProps<T extends FieldValues> = {
  name: FieldPath<T>
  control: Control<T>
  label: React.ReactNode
  /** input[type=file] accept */
  accept: string
  /** Alan zorunlu (ör. genel yükleme sırasında) */
  required?: boolean
  /** Alan devre dışı (ör. genel yükleme sırasında) */
  disabled?: boolean
  /** Bu alan için yükleme süreci göstergesi */
  isBusy?: boolean
  /** Yerel önizleme URL’i (ör. createObjectURL); görsel veya PDF */
  previewUrl?: string
  /** `previewUrl` varken içerik türü — `image/*` için `img`, `application/pdf` için gömülü PDF */
  previewMimeType?: string
  /** Dosya seçildiğinde (input veya sürükle-bırak); yükleme ve setValue genelde üst bileşende */
  onFileSelect: (file: File) => void
  /** Kaldır; üst bileşen form alanını sıfırlamalı */
  onClear: () => void
  formItemClassName?: string
  dropzoneClassName?: string
  /** Boş durumda (önizleme yok, field boş) dropzone içeriği — ikon ve metinler */
  children: React.ReactNode
  busyLabel?: string
  uploadedLabel?: string
  clearAriaLabelPrefix?: string
}

export function FormFileDropzoneField<T extends FieldValues>({
  name,
  control,
  label,
  accept,
  required = false,
  disabled = false,
  isBusy = false,
  previewUrl,
  previewMimeType,
  onFileSelect,
  onClear,
  formItemClassName,
  dropzoneClassName,
  children,
  busyLabel = 'Yükleniyor...',
  uploadedLabel = 'Dosya yüklendi',
  clearAriaLabelPrefix
}: FormFileDropzoneFieldProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const openPicker = () => {
    if (!disabled && !previewUrl) inputRef.current?.click()
  }

  const labelText = typeof label === 'string' ? label : 'Dosya'

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const fieldValue = field.value as string | undefined

        return (
          <FormItem className={formItemClassName}>
            <FormLabel>
              {label}
              {required && <span className='ml-0.5'>*</span>}
            </FormLabel>
            <FormControl>
              <div
                role='button'
                tabIndex={0}
                aria-label={labelText}
                aria-busy={isBusy}
                onClick={openPicker}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openPicker()
                  }
                }}
                onDragOver={e => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onDragEnter={e => {
                  e.preventDefault()
                  if (!disabled) setDragOver(true)
                }}
                onDragLeave={e => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(false)
                }}
                onDrop={e => {
                  e.preventDefault()
                  setDragOver(false)
                  if (disabled) return
                  const file = e.dataTransfer.files?.[0]
                  if (file) onFileSelect(file)
                }}
                className={cn(
                  'bg-muted/30 relative flex min-h-[140px] flex-col items-center justify-center overflow-hidden rounded-md border border-dashed p-2 text-center transition-colors',
                  disabled && 'cursor-not-allowed opacity-70',
                  dragOver && 'border-primary bg-primary/10',
                  !dragOver && 'border-border hover:bg-muted',
                  fieldState.error && 'border-destructive/60',
                  !previewUrl && 'cursor-pointer',
                  dropzoneClassName
                )}
              >
                <input
                  ref={inputRef}
                  type='file'
                  accept={accept}
                  className='sr-only'
                  disabled={disabled}
                  onChange={e => {
                    const file = e.target.files?.[0]
                    e.target.value = ''
                    if (file) onFileSelect(file)
                  }}
                  onClick={e => e.stopPropagation()}
                />

                <FileDropzonePreviewContent
                  previewUrl={previewUrl}
                  previewMimeType={previewMimeType}
                  labelText={labelText}
                  fieldValue={fieldValue}
                  uploadedLabel={uploadedLabel}
                  emptyChildren={children}
                />

                {isBusy && <FileDropzoneBusyOverlay label={busyLabel} />}

                {fieldValue && !isBusy && (
                  <TooltippedElement tooltipContent='Dosyayı kaldır' className='text-xs'>
                    <Button
                      type='button'
                      size='icon-xs'
                      color='destructive'
                      className='absolute top-1 right-1'
                      aria-label={clearAriaLabelPrefix ? `${clearAriaLabelPrefix} kaldır` : 'Dosyayı kaldır'}
                      onClick={e => {
                        e.stopPropagation()
                        onClear()
                      }}
                    >
                      <Trash2 className='size-4' />
                    </Button>
                  </TooltippedElement>
                )}
              </div>
            </FormControl>
            <FormMessage className='-mt-2' />
          </FormItem>
        )
      }}
    />
  )
}
