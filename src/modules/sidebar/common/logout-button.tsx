import { ConfirmButton } from '@/components/ui/confirm-button'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'

interface LogoutButtonProps {
  expanded: boolean
  hovered: boolean
  mobileMenu: boolean
}

export default function LogoutButton({ expanded, hovered, mobileMenu }: LogoutButtonProps) {
  const { logout } = useAuth()

  return (
    <ConfirmButton
      confirmationMessage={<p className='text-xs'>Çıkış yapmak istediğinize emin misiniz?</p>}
      confirmButtonMessage={
        <div className='flex items-center gap-2 text-xs'>
          <LogOut className='h-5 w-5' /> Çıkış Yap
        </div>
      }
      cancelButtonMessage='İptal'
      confirmButtonProps={{ className: 'text-xs px-2 py-1', color: 'destructive' }}
      cancelButtonProps={{ className: 'text-xs px-2 py-1' }}
      variant='outline'
      color='destructive'
      size='icon'
      className='flex w-full items-center gap-2'
      onConfirm={logout}
    >
      <LogOut className='h-5 w-5' />
      {(expanded || hovered || mobileMenu) && (
        <motion.span
          className='text-md font-semibold'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Çıkış Yap
        </motion.span>
      )}
    </ConfirmButton>
  )
}
