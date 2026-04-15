'use client'

import { Stepper } from '@/components/stepper'
import { Button } from '@/components/ui/button'
import { OnboardingStepContent } from '@/modules/tenant/onboarding'
import { OnboardingHeading } from '@/modules/tenant/onboarding/components/OnboardingHeading'
import { useOnboarding } from '@/modules/tenant/onboarding/context/OnboardingContext'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useFormState } from 'react-hook-form'

export default function OnboardingPage() {
  const searchParams = useSearchParams()
  const { onboardingContactForm, step, goToContactInformation, goToVerification, isContactInformationStepCompleted } =
    useOnboarding()
  const isSuccess = searchParams.get('success') === 'true'

  const { isDirty } = useFormState({
    control: onboardingContactForm.control
  })

  if (isSuccess) {
    return (
      <>
        <OnboardingHeading
          variant='page'
          title={
            <div className='w-full text-center'>
              <div className='mx-auto mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
                <CheckCircle className='size-9 text-green-600' />
              </div>
              <h2 className='text-xl font-semibold text-gray-900'>Başarılı</h2>
            </div>
          }
          description='Partner hesabınız başarıyla oluşturulmuştur. Şifrenizi belirleyerek hesabınıza giriş yapabilirsiniz.'
        />
        <Button asChild className='w-full' size='md'>
          <Link href='/onboarding/set-password'>Şifre Belirle</Link>
        </Button>
      </>
    )
  }

  return (
    <>
      <OnboardingHeading variant='page' title='Başvuru Formu' />
      <Stepper
        items={[
          {
            key: 'ContactInformation',
            label: 'İletişim Bilgileri',
            onClick: goToContactInformation
          },
          {
            key: 'Verification',
            label: 'Doğrulama',
            onClick: goToVerification,
            disabled: !isContactInformationStepCompleted || isDirty
          }
        ]}
        activeKey={step}
      />
      <OnboardingStepContent />
    </>
  )
}
