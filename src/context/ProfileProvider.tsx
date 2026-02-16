import { profileService } from '@/service/profile.service'
import { IProfileResponse } from '@/types/profile'
import { useQuery } from '@tanstack/react-query'
import posthog from 'posthog-js'
import { createContext, useContext, useEffect, useRef } from 'react'

type ProfileContextValue = {
  profile: IProfileResponse | undefined
  isLoading: boolean
}

type ProfileProviderProps = {
  children: React.ReactNode
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined)

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const lastIdentifiedUserIdRef = useRef<string | null>(null)
  const {
    data: profileData,
    isLoading,
    isFetching
  } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(),
    staleTime: 1000 * 60 * 5 // 5 dakika
  })

  useEffect(() => {
    if (!profileData || !profileData.userId) return
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return
    if (lastIdentifiedUserIdRef.current === profileData.userId) return

    posthog.identify(profileData.userId, {
      email: profileData.email,
      accountId: profileData.accountId,
      restaurantId: profileData.restaurantId,
      omsRestaurantId: profileData.omsRestaurantId,
      name: profileData.info?.name,
      channelId: profileData.info?.channelId
    })
    lastIdentifiedUserIdRef.current = profileData.userId
  }, [profileData, lastIdentifiedUserIdRef])

  return (
    <ProfileContext.Provider value={{ profile: profileData, isLoading: isLoading || isFetching }}>
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
