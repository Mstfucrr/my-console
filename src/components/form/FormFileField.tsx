import { Button } from '@/components/ui/button'
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { Upload } from 'lucide-react'
import { useRef } from 'react'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'
import { toast } from 'react-toastify'

interface FormFileFieldProps<T extends FieldValues> {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  accept?: string
  formItemClassName?: string
  required?: boolean
  buttonText?: string
  changeButtonText?: string
  maxSize?: number
}

export function FormFileField<T extends FieldValues>({
  name,
  control,
  label,
  accept = '.pdf,.jpg,.jpeg,.png',
  formItemClassName,
  required,
  buttonText = 'Dosya Seç',
  changeButtonText = 'Dosya Değiştir',
  maxSize = 10 * 1024 * 1024
}: FormFileFieldProps<T>) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {
    field: { value, onChange },
    fieldState: { error }
  } = useController({ name, control })

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > maxSize) {
        toast.error(`Dosya boyutu ${maxSize / 1024 / 1024}MB&apos;den büyük olamaz.`)
        return
      }
      if (!accept.includes(file.type.split('/')[1])) {
        toast.error(`Sadece ${accept.split(',').join(', ')} dosya türleri yükleyebilirsiniz.`)
        return
      }
      onChange(file)
    }
  }

  const file = value as File | null

  return (
    <FormItem className={formItemClassName}>
      {label && (
        <FormLabel htmlFor={name} className={cn('text-sm font-medium', error && 'text-red-500')}>
          {label}
          {required && <span className='ml-0.5'>*</span>}
        </FormLabel>
      )}
      <FormControl>
        <div className='flex items-center gap-3'>
          <input ref={fileInputRef} type='file' accept={accept} onChange={handleFileChange} className='hidden' />
          <Button type='button' onClick={handleFileSelect} variant='outline' className='flex items-center gap-2'>
            <Upload className='h-4 w-4' />
            {file ? changeButtonText : buttonText}
          </Button>
          {file && <span className='text-sm text-gray-600'>{file.name}</span>}
        </div>
      </FormControl>
      {error && <FormMessage className='-mt-2'>{error.message}</FormMessage>}
    </FormItem>
  )
}
