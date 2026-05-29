import { isPosthogEnabled } from '@/provider/AnalyticsProvider'
import { profileService } from '@/service/profile.service'
import { IProfileResponse } from '@/types/profile'
import { useQuery } from '@tanstack/react-query'
import posthog from 'posthog-js'
import { createContext, useContext, useEffect } from 'react'

type ProfileContextValue = {
  profile: IProfileResponse | undefined
  isLoading: boolean
  isError: boolean
}

type ProfileProviderProps = {
  children: React.ReactNode
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined)

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const {
    data: profileData,
    isLoading,
    isError,
    isFetching
  } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(),
    staleTime: 1000 * 60 * 5 // 5 dakika
  })

  useEffect(() => {
    const uid = profileData?.userId
    if (!uid || !isPosthogEnabled) return
    posthog.identify(uid, {
      email: profileData.email,
      accountId: profileData.accountId,
      restaurantId: profileData.restaurantId,
      omsRestaurantId: profileData.omsRestaurantId,
      name: profileData.info?.name,
      channelId: profileData.info?.channelId,
      accountType: profileData.accountType,
      tenantData: profileData.data?.merchantId
        ? {
            merchantId: profileData.data.merchantId,
            companyType: profileData.data.financialDetails?.companyType,
            companyName: profileData.data.financialDetails?.companyName,
            name: profileData.data.firstName + ' ' + profileData.data.surname,
            email: profileData.data.email,
            phoneNumber: profileData.data.phoneNumber
          }
        : undefined
    })
  }, [profileData])

  return (
    <ProfileContext.Provider value={{ profile: profileData, isLoading: isLoading || isFetching, isError }}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
