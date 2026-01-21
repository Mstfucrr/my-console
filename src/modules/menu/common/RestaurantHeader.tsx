import { PageHeader } from '@/components/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile } from '@/context/ProfileProvider'
import { Store } from 'lucide-react'

export function RestaurantHeader() {
  const { profile, isLoading: isProfileLoading } = useProfile()

  if (isProfileLoading) return <Skeleton className='-my-1 h-6 w-full self-center' />

  if (!profile?.info.name) return null

  const restaurantName = profile.info.name.charAt(0).toUpperCase() + profile.info.name.slice(1)

  return <PageHeader title={restaurantName} icon={Store} iconColor='text-primary' />
}
