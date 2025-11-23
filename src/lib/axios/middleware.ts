import { getToken } from '@/lib/local-storage-helper'
import { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'

const STORAGE_KEY = 'user'

// Backend hata yanıt formatı
interface BackendError {
  statusCode: number
  message: string
  error: string
}

type RequestMiddleware = (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
type ResponseMiddleware = (response: AxiosResponse) => AxiosResponse
type ErrorMiddleware = (error: AxiosError<BackendError>) => Promise<never>

const isNetworkError = (error: AxiosError) =>
  error.message === 'Network Error' || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK'

const isAuthError = (error: AxiosError<BackendError>) =>
  error.response?.status === 401 || (error.response?.status === 403 && error.response.data?.error === 'Unauthorized')

// Yönlendirme döngülerini önlemek için URL başına yasaklı hata sayısını takip eder
const forbiddenCounts: Record<string, number> = {}

// Token varsa isteklere Authorization header'ı ekler
export const authHeaderMiddleware: RequestMiddleware = config => {
  if (config.headers['Authorization']) return config

  try {
    const { accessToken } = getToken()
    if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`
    else throw new Error('Token bulunamadı')
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('authHeaderMiddleware: Token bulunamadı', error)
    }
  }

  return config
}

// Public API çağrıları için hata yönetimi (login, register, vb.)
export const publicErrorMiddleware: ErrorMiddleware = async error => {
  if (isNetworkError(error)) {
    console.error('publicErrorMiddleware: Sunucuya bağlanırken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.')
    return Promise.reject(error)
  }

  return Promise.reject(error)
}

// Private API çağrıları için hata yönetimi (kimlik doğrulama gerektirir)
export const privateErrorMiddleware: ErrorMiddleware = async error => {
  if (isNetworkError(error) && window.location.pathname !== '/500') {
    console.log('network error', error)
    return Promise.reject(error)
  }

  if (isAuthError(error) && !window.location.pathname.includes('/login')) {
    console.error('auth error', error)
    localStorage.removeItem(STORAGE_KEY)
    window.location.href = '/login'
    return Promise.reject(error)
  }

  const status = error.response?.status
  const url = error.response?.config.url as string

  // 403 hatası: Döngüleri önlemek için 3 ardışık hatadan sonra yönlendir
  if (status === 403) {
    forbiddenCounts[url] = (forbiddenCounts[url] || 0) + 1
    if (forbiddenCounts[url] > 2 && window.location.pathname !== '/403') {
      console.log('forbidden error', error)
      return Promise.reject(error)
    } else {
      return Promise.reject(error)
    }
  }

  // 429 hatası: Rate limit aşıldı
  if (status === 429 && !window.location.pathname.includes('/429')) {
    console.log('rate limit error', error)
    return Promise.reject(error)
  }

  return Promise.reject(error)
}

// Başarılı yanıtta yasaklı hata sayacını sıfırlar
export const successResponseMiddleware: ResponseMiddleware = response => {
  forbiddenCounts[response.config.url as string] = 0
  return response
}

// 401/403 hatalarında access token'ı otomatik olarak yeniler
export const tokenRefreshMiddleware = (instance: AxiosInstance, publicInstance: AxiosInstance) => {
  createAuthRefreshInterceptor(
    instance,
    async (failedRequest: AxiosError<BackendError>) => {
      try {
        const { refreshToken } = getToken()
        const { data } = await publicInstance.post<{ accessToken: string }>('/auth/refresh', { refreshToken })
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ accessToken: data.accessToken, refreshToken }))
        if (failedRequest.response?.config) {
          failedRequest.response.config.headers['Authorization'] = `Bearer ${data.accessToken}`
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY)
        console.log('token refresh error', failedRequest.response)
      }
    },
    { statusCodes: [401, 403] }
  )
}

// Bir axios instance'ına birden fazla request middleware'i uygular
export const applyRequestMiddleware = (instance: AxiosInstance, ...middlewares: RequestMiddleware[]) => {
  middlewares.forEach(m => instance.interceptors.request.use(m, e => Promise.reject(e)))
}

// Bir axios instance'ına başarı ve hata response middleware'lerini uygular
export const applyResponseMiddleware = (
  instance: AxiosInstance,
  success: ResponseMiddleware,
  error: ErrorMiddleware
) => {
  instance.interceptors.response.use(success, error)
}
