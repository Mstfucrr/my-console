import axios, { AxiosInstance } from 'axios'
import {
  applyRequestMiddleware,
  applyResponseMiddleware,
  authHeaderMiddleware,
  posthogErrorMiddleware,
  privateErrorMiddleware,
  publicErrorMiddleware,
  requestTimingMiddleware,
  successResponseMiddleware,
  tokenRefreshMiddleware
} from './middleware'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL + '/'
const commonConfig = {
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
}

// Kimlik doğrulama gerektirmeyen istekler için public axios instance (login, register, vb.)
export const publicAxiosInstance: AxiosInstance = axios.create(commonConfig)
applyRequestMiddleware(publicAxiosInstance, requestTimingMiddleware)
applyResponseMiddleware(
  publicAxiosInstance,
  successResponseMiddleware,
  posthogErrorMiddleware('public', publicErrorMiddleware)
)

// Kimlik doğrulama gerektiren istekler için private axios instance
export const privateAxiosInstance: AxiosInstance = axios.create(commonConfig)
tokenRefreshMiddleware(privateAxiosInstance, publicAxiosInstance)
applyRequestMiddleware(privateAxiosInstance, requestTimingMiddleware, authHeaderMiddleware)
applyResponseMiddleware(
  privateAxiosInstance,
  successResponseMiddleware,
  posthogErrorMiddleware('private', privateErrorMiddleware)
)
