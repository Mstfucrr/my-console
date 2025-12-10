import { profileService } from '@/service/profile.service'
import { IProfileResponse } from '@/types/profile'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useEffect } from 'react'

type ProfileContextValue = {
  profile: IProfileResponse | undefined
}

type ProfileProviderProps = {
  children: React.ReactNode
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined)

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile()
  })

  useEffect(() => {
    console.log('profile', profileData)
  }, [profileData])

  return <ProfileContext.Provider value={{ profile: profileData }}>{children}</ProfileContext.Provider>
}

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
