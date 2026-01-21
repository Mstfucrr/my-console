import { TooltippedElement } from '@/components/tooltipped-element'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useProfile } from '@/context/ProfileProvider'
import { cn } from '@/lib/utils'
import { Key, LucideIcon, Mail, Phone, User } from 'lucide-react'
import { LogoutButton } from './logout-button'

const ProfileItem = ({
  icon: Icon,
  label,
  tooltipContent
}: {
  icon: LucideIcon
  label: string
  tooltipContent: string
}) => {
  return (
    <TooltippedElement side='left' tooltipContent={tooltipContent}>
      <div className='bg-accent/40 flex items-center gap-2 rounded-md p-1.5 text-sm'>
        <Icon className='text-primary size-5' />
        <span>{label}</span>
      </div>
    </TooltippedElement>
  )
}

export function ProfileButton({ className }: { className?: string }) {
  const { profile } = useProfile()
  if (!profile) return null
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button color='primary' className={cn('rounded-full', className)} size='icon-sm'>
          <User className='size-6' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='max-w-max p-2' align='end'>
        <div className='flex flex-col gap-2'>
          <ProfileItem icon={Key} label={profile.accountId} tooltipContent='Hesap ID' />
          <ProfileItem icon={Mail} label={profile.email} tooltipContent='E-posta adresi' />
          <ProfileItem icon={Phone} label={profile.info.authPhone} tooltipContent='Telefon Numarası' />
          <LogoutButton showLabel className='w-full' />
        </div>
      </PopoverContent>
    </Popover>
  )
}
