'use client'

import { FormInputField } from '@/components/form/FormInputField'
import { FormMaskedInputField } from '@/components/form/FormMaskedInputField'
import { Button } from '@/components/ui/button'
import { Form, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { LoadingButton } from '@/components/ui/loading-button'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Building, User } from 'lucide-react'
import { useController } from 'react-hook-form'
import { useWelcomeOnboarding } from '../context/welcome-onboarding-context'
import type { WelcomeCompanyType } from '../types'
import { WelcomeDocumentUploadSection } from './welcome-document-upload-section'

const COMPANY_TYPES: WelcomeCompanyType[] = ['Bireysel', 'Kurumsal']

export function WelcomeFinancialForm() {
  const { form, taxNumberDisplay, onFinancialSubmit, onFinancialCancel, isCreatingFinance } = useWelcomeOnboarding()
  const companyType = form.watch('companyType')
  const {
    field: companyTypeField,
    fieldState: { error: companyTypeError }
  } = useController({ name: 'companyType', control: form.control })

  const setCompanyType = (v: WelcomeCompanyType) => {
    companyTypeField.onChange(v)
    form.setValue('tckn', '')
    if (v === 'Bireysel') {
      form.setValue('signatureCircularKey', '', { shouldDirty: true, shouldValidate: false })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFinancialSubmit)} className='flex flex-col gap-x-4 gap-y-2'>
        <FormItem>
          <FormLabel className='text-sm font-medium'>
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
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
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
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className='content-end overflow-hidden'
              >
                <FormInputField
                  name='vkn'
                  control={form.control}
                  label='VKN'
                  placeholder='10 haneli VKN'
                  autoFirstLetterUppercase
                  value={taxNumberDisplay}
                  disabled
                  readOnly
                />
              </motion.div>
            )}

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
          </AnimatePresence>
        </div>

        <WelcomeDocumentUploadSection />

        <div className='flex gap-3 pt-4'>
          <Button type='button' size='sm' variant='outline' className='flex-1' onClick={onFinancialCancel}>
            İptal
          </Button>
          <LoadingButton type='submit' size='sm' className='flex-1 gap-2' isLoading={isCreatingFinance}>
            Kaydet ve Devam Et
            <ArrowRight className='h-4 w-4' />
          </LoadingButton>
        </div>
      </form>
    </Form>
  )
}
