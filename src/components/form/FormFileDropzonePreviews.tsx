'use client'

import CustomImage from '@/components/image'
import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'
import { Expand, FileText, Loader2, X } from 'lucide-react'
import { memo, useEffect, useState } from 'react'

type FileDropzoneImagePreviewProps = {
  src: string
  alt: string
}

export function FileDropzoneImagePreview({ src, alt }: FileDropzoneImagePreviewProps) {
  return <CustomImage src={src} alt={alt} className='max-h-[120px] max-w-full object-contain' />
}

type FileDropzonePdfPreviewProps = {
  src: string
  title: string
}

export function FileDropzonePdfPreview({ src, title }: FileDropzonePdfPreviewProps) {
  return (
    <iframe
      title={title}
      src={src}
      className='border-border bg-background h-[120px] w-full max-w-full rounded border'
    />
  )
}

type FileDropzoneUploadedPlaceholderProps = {
  label: string
}

export function FileDropzoneUploadedPlaceholder({ label }: FileDropzoneUploadedPlaceholderProps) {
  return (
    <div className='flex flex-col items-center gap-2'>
      <FileText className='text-muted-foreground size-12 shrink-0' aria-hidden />
      <span className='text-muted-foreground text-sm'>{label}</span>
    </div>
  )
}

type FileDropzoneBusyOverlayProps = {
  label: string
}

export function FileDropzoneBusyOverlay({ label }: FileDropzoneBusyOverlayProps) {
  return (
    <div className='bg-background/80 absolute inset-0 flex flex-col items-center justify-center gap-2 backdrop-blur-[1px]'>
      <Loader2 className='text-primary size-5 animate-spin' />
      <p className='text-sm font-medium'>{label}</p>
    </div>
  )
}

export type FileDropzonePreviewContentProps = {
  previewUrl?: string
  previewMimeType?: string
  labelText: string
  fieldValue: string | undefined
  uploadedLabel: string
  emptyChildren: React.ReactNode
}

function FileDropzonePreviewContentInner({
  previewUrl,
  previewMimeType,
  labelText,
  fieldValue,
  uploadedLabel,
  emptyChildren
}: Omit<FileDropzonePreviewContentProps, 'layoutId'>) {
  if (previewUrl) {
    const mime = previewMimeType ?? ''
    if (mime === 'application/pdf')
      return <FileDropzonePdfPreview src={previewUrl} title={`${labelText} PDF önizleme`} />
    return <FileDropzoneImagePreview src={previewUrl} alt={labelText} />
  }
  if (fieldValue) return <FileDropzoneUploadedPlaceholder label={uploadedLabel} />
  return emptyChildren
}

const FileDropzoneLightbox = memo(function FileDropzoneLightbox({
  open,
  onClose,
  previewUrl,
  previewMimeType,
  labelText
}: {
  open: boolean
  onClose: () => void
  previewUrl: string
  previewMimeType?: string
  labelText: string
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const isPdf = previewMimeType === 'application/pdf'

  return (
    <motion.div
      layoutId='file-dropzone-lightbox'
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-1 sm:p-4'
      role='dialog'
      aria-modal
      aria-label={labelText}
      onClick={onClose}
    >
      <div
        className='bg-background relative max-h-[70vh] w-full max-w-2xl overflow-auto rounded-lg p-3 md:max-h-[80vh] md:p-8'
        onClick={e => e.stopPropagation()}
      >
        <Button
          type='button'
          color='light'
          size='icon-sm'
          className='absolute top-2 right-2 z-10'
          onClick={onClose}
          aria-label='Kapat'
        >
          <X className='size-4' />
        </Button>
        {isPdf ? (
          <iframe
            title={`${labelText} PDF önizleme`}
            src={`${previewUrl}#toolbar=0`}
            loading='lazy'
            className='border-border bg-background h-[min(80vh,720px)] max-h-[65vh] min-h-[40vh] w-full rounded border md:max-h-[70vh]'
          />
        ) : (
          <CustomImage src={previewUrl} alt={labelText} className='max-h-[min(85vh,900px)] w-full object-contain' />
        )}
      </div>
    </motion.div>
  )
})

export function FileDropzonePreviewContent(props: FileDropzonePreviewContentProps) {
  const [expandOpen, setExpandOpen] = useState(false)
  const canExpand = Boolean(props.previewUrl)

  return (
    <>
      <div className='relative flex w-full flex-col items-center justify-center'>
        <FileDropzonePreviewContentInner {...props} />
        {canExpand && (
          <Button
            type='button'
            size='icon-sm'
            className='absolute right-2 bottom-2 z-10 opacity-90 shadow-sm hover:opacity-100'
            onClick={e => {
              e.stopPropagation()
              setExpandOpen(true)
            }}
            aria-label='Genişlet'
          >
            <Expand className='size-4' />
          </Button>
        )}
      </div>

      <AnimatePresence mode='wait'>
        {canExpand && (
          <FileDropzoneLightbox
            open={expandOpen}
            onClose={() => setExpandOpen(false)}
            previewUrl={props.previewUrl!}
            previewMimeType={props.previewMimeType}
            labelText={props.labelText}
          />
        )}
      </AnimatePresence>
    </>
  )
}
