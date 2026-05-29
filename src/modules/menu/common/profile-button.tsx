'use client'
import { TooltippedElement } from '@/components/tooltipped-element'
import { Button } from '@/components/ui/button'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useProfile } from '@/context/ProfileProvider'
import { isActiveTenant, isTenantUser } from '@/lib/permissions'
import { cn } from '@/lib/utils'
import { Key, LucideIcon, Mail, Phone, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from './logout-button'

const ProfileItem = ({
  icon: Icon,
  label,
  tooltipContent = ''
}: {
  icon: LucideIcon
  label?: string
  tooltipContent?: string
}) => {
  if (!label) return null
  return (
    <TooltippedElement side='left' tooltipContent={tooltipContent}>
      <div className='bg-accent/40 flex items-center gap-2 rounded-md p-1.5 text-sm'>
        <Icon className='text-primary size-5' />
        <span>{label}</span>
      </div>
    </TooltippedElement>
  )
}

export function ProfileButton({ className, onClick }: { className?: string; onClick?: () => void }) {
  const { profile } = useProfile()
  const pathname = usePathname()

  const isTenant = isTenantUser(profile)

  const isBusinessSetupPage = pathname === '/business-setup'

  if (!profile) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          color='primary'
          className={cn('rounded-full', className)}
          size='icon-sm'
          data-testid='profile-menu-button'
        >
          <User className='size-6' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='max-w-max p-2' align='end' side='top'>
        <div className='flex flex-col gap-2'>
          {isTenant ? (
            <PopoverClose asChild>
              <Button
                color='primary'
                hidden={isBusinessSetupPage || !isActiveTenant}
                asChild
                className='flex w-full items-center gap-2'
                size='sm'
                onClick={onClick}
              >
                <Link href='/account'>
                  <span>Hesabım</span>
                </Link>
              </Button>
            </PopoverClose>
          ) : (
            <>
              <ProfileItem icon={Key} label={profile.accountId} tooltipContent='Hesap ID' />
              <ProfileItem icon={Mail} label={profile.email} tooltipContent='E-posta adresi' />
              {profile.info && (
                <ProfileItem icon={Phone} label={profile.info.authPhone} tooltipContent='Telefon Numarası' />
              )}
            </>
          )}
          <LogoutButton showLabel className='w-full' />
        </div>
      </PopoverContent>
    </Popover>
  )
}
