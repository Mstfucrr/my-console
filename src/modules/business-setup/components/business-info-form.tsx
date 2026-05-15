'use client'

import { FormInputField } from '@/components/form/FormInputField'
import { FormMaskedInputField } from '@/components/form/FormMaskedInputField'
import { Button } from '@/components/ui/button'
import { Form, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { LoadingButton } from '@/components/ui/loading-button'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Building, Building2Icon, LucideIcon, User } from 'lucide-react'
import { useController } from 'react-hook-form'
import { useBusinessSetup } from '../context/business-setup-context'
import type { BusinessInfoAccountType, BusinessInfoCompanyType } from '../types'
import { BusinessInfoDocumentUploadSection } from './business-info-document-upload-section'

const COMPANY_TYPES: BusinessInfoCompanyType[] = ['Bireysel', 'Kurumsal']
const ACCOUNT_TYPES: { value: BusinessInfoAccountType; label: string; Icon: LucideIcon }[] = [
  { value: 'platform', label: 'Platform', Icon: Building2Icon },
  { value: 'tenant', label: 'İşletme', Icon: User }
]

export function BusinessInfoForm() {
  const { form, onBusinessInfoSubmit, onBusinessInfoCancel, isSavingBusinessInfo } = useBusinessSetup()
  const companyType = form.watch('companyType')
  const {
    field: accountTypeField,
    fieldState: { error: accountTypeError }
  } = useController({ name: 'accountType', control: form.control })
  const {
    field: companyTypeField,
    fieldState: { error: companyTypeError }
  } = useController({ name: 'companyType', control: form.control })

  const setCompanyType = (v: BusinessInfoCompanyType) => {
    companyTypeField.onChange(v)
    if (v !== 'Bireysel') form.setValue('tckn', '')
    void form.trigger(['idFrontKey', 'idBackKey', 'signatureCircularKey', 'tradeRegistryGazetteKey'])
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onBusinessInfoSubmit)} className='flex flex-col gap-x-4 gap-y-2'>
        <div className='grid gap-x-4 gap-y-2 sm:grid-cols-2'>
          <FormItem>
            <FormLabel className={cn('mb-1 text-sm font-medium', accountTypeError && 'text-red-500')}>
              Hesap Türü<span className='ml-0.5'>*</span>
            </FormLabel>
            <div className='mt-1 grid grid-cols-2 gap-3'>
              {ACCOUNT_TYPES.map(type => (
                <Button
                  key={type.value}
                  type='button'
                  data-testid={`business-info-account-type-${type.value}`}
                  size='md'
                  variant={accountTypeField.value === type.value ? undefined : 'outline'}
                  onClick={() => accountTypeField.onChange(type.value)}
                  className={cn('flex items-center justify-center gap-3', accountTypeError && 'border-red-500')}
                >
                  <type.Icon className='size-5' />
                  <span className='text-sm font-medium'>{type.label}</span>
                </Button>
              ))}
            </div>
          </FormItem>

          <FormItem>
            <FormLabel className='mb-1 text-sm font-medium'>
              Şirket Türü<span className='ml-0.5'>*</span>
            </FormLabel>
            <div className='mt-1 grid grid-cols-2 gap-3'>
              {COMPANY_TYPES.map(type => (
                <Button
                  key={type}
                  type='button'
                  size='md'
                  variant={companyTypeField.value === type ? undefined : 'outline'}
                  onClick={() => setCompanyType(type)}
                  className='flex items-center justify-center gap-3'
                >
                  {type === 'Bireysel' ? <User className='h-5 w-5' /> : <Building className='h-5 w-5' />}
                  <span className='text-sm font-medium'>{type}</span>
                </Button>
              ))}
            </div>
            {companyTypeError && <FormMessage>{companyTypeError.message}</FormMessage>}
          </FormItem>
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <FormInputField
            name='companyName'
            autoFocus
            control={form.control}
            label='Şirket Adı'
            required
            placeholder='Şirket unvanı'
            autoFirstLetterUppercase
            tabIndex={1}
          />
          <FormInputField
            name='taxOffice'
            control={form.control}
            label='Vergi Dairesi'
            required
            placeholder='Örn. Kadıköy V.D.'
            autoFirstLetterUppercase
            tabIndex={2}
          />
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <AnimatePresence mode='wait'>
            {companyType === 'Bireysel' ? (
              <motion.div
                key='tckn'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='overflow-hidden'
              >
                <FormMaskedInputField
                  mask='0 0 0 0 0 0 0 0 0 0 0'
                  lazy={false}
                  type='text'
                  tabIndex={2}
                  name='tckn'
                  required
                  control={form.control}
                  label='TCKN'
                  placeholder='11 haneli TC'
                />
              </motion.div>
            ) : (
              <motion.div
                key='vkn'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className='content-end overflow-hidden'
              >
                <FormMaskedInputField
                  mask='0 0 0 0 0 0 0 0 0 0'
                  lazy={false}
                  type='text'
                  name='vkn'
                  control={form.control}
                  label='VKN'
                  placeholder='10 haneli VKN'
                  tabIndex={-1}
                  className='font-mono'
                  disabled
                  readOnly
                />
              </motion.div>
            )}
          </AnimatePresence>

          <FormMaskedInputField
            mask='TR00 0000 0000 0000 0000 0000 00'
            lazy={false}
            type='text'
            name='iban'
            required
            control={form.control}
            label='IBAN'
            placeholder='TR33 0006 1005 1978 6457 8413 26'
            className='font-mono'
            tabIndex={3}
          />
        </div>

        <BusinessInfoDocumentUploadSection />

        <div className='flex gap-3 pt-4'>
          <Button type='button' size='sm' variant='outline' className='flex-1' onClick={onBusinessInfoCancel}>
            İptal
          </Button>
          <LoadingButton type='submit' size='sm' className='flex-1 gap-2' isLoading={isSavingBusinessInfo}>
            Kaydet ve Devam Et
            <ArrowRight className='h-4 w-4' />
          </LoadingButton>
        </div>
      </form>
    </Form>
  )
}
