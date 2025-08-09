import { Input, InputProps } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'

interface PasswordInputProps extends InputProps {
  className?: string
}

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={cn('relative', className)}>
      <Input type={showPassword ? 'text' : 'password'} {...props} />
      <Button
        variant='ghost'
        className='absolute top-1/2 right-0 -translate-y-1/2'
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  )
}
