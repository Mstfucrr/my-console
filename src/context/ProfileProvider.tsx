import { profileService } from '@/service/profile.service'
import { IProfileResponse } from '@/types/profile'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext } from 'react'

type ProfileContextValue = {
  profile: IProfileResponse | undefined
  isLoading: boolean
}

type ProfileProviderProps = {
  children: React.ReactNode
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined)

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const {
    data: profileData,
    isLoading,
    isFetching
  } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(),
    staleTime: 1000 * 60 * 5 // 5 dakika
  })

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
