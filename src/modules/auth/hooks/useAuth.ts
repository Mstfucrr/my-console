import { useQuery } from '@tanstack/react-query'
import { authService } from '../service/auth.service'

const useGetSigninCookie = () => {
  const getSigninCookie = useQuery({
    queryKey: ['signinCookie'],
    queryFn: authService.getSigninCookie
  })
  return getSigninCookie
}

export { useGetSigninCookie }
