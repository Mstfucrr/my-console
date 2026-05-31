'use client'

import { useProfile } from '@/context/ProfileProvider'
import { AccountBusinessCard } from './components/account-business-card'
import { AccountDocumentsCard } from './components/account-documents-card'
import { AccountProfileCard } from './components/account-profile-card'

export function AccountView() {
  const { profile } = useProfile()

  const data = profile?.data

  return (
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
      <AccountProfileCard data={data} />
      <AccountBusinessCard data={data} />
      <AccountDocumentsCard financialDetails={data?.financialDetails} />
    </div>
  )
}
