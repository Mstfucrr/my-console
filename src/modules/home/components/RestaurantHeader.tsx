import { Skeleton } from '@/components/ui/skeleton'
import { useProfile } from '@/context/ProfileProvider'

export function RestaurantHeader() {
  const { profile, isLoading: isProfileLoading } = useProfile()
  if (isProfileLoading) {
    return <Skeleton className='-my-1 h-8 w-full max-w-sm self-center' />
  }

  return (
    profile?.info.name && (
      <div className='flex w-full items-center gap-3 max-sm:justify-center max-sm:text-center'>
        <h1 className='text-primary flex gap-x-1 text-base font-bold max-sm:flex-col max-sm:text-sm'>
          <span>Hoşgeldiniz,</span>
          <span>{profile?.info.name.charAt(0).toUpperCase() + profile?.info.name.slice(1)}</span>
        </h1>
      </div>
    )
  )
}
