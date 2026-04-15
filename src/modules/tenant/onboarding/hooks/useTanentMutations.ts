import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { tanentService } from '../service/tanent.service'
import type {
  TenantApplicationCompleteRequest,
  TenantApplicationCompleteResponse,
  TenantApplicationRequest,
  TenantApplicationResponse,
  TenantOtpSendRequest,
  TenantOtpSendResponse,
  TenantOtpVerifyRequest,
  TenantOtpVerifyResponse,
  TenantPasswordSetupRequest,
  TenantPasswordSetupResponse
} from '../service/tanent.service.type'

export function useSubmitTenantApplicationMutation(
  options?: Omit<
    UseMutationOptions<TenantApplicationResponse, Error, TenantApplicationRequest>,
    'mutationKey' | 'mutationFn'
  >
) {
  return useMutation({
    mutationKey: ['tanent', 'application', 'submit'],
    mutationFn: (request: TenantApplicationRequest) => tanentService.submitApplication(request),
    ...options
  })
}

export function useSendTenantOtpMutation(
  options?: Omit<UseMutationOptions<TenantOtpSendResponse, Error, TenantOtpSendRequest>, 'mutationKey' | 'mutationFn'>
) {
  return useMutation({
    mutationKey: ['tanent', 'application', 'otp', 'send'],
    mutationFn: (request: TenantOtpSendRequest) => tanentService.sendOtp(request),
    ...options
  })
}

export function useVerifyTenantOtpMutation(
  options?: Omit<
    UseMutationOptions<TenantOtpVerifyResponse, Error, TenantOtpVerifyRequest>,
    'mutationKey' | 'mutationFn'
  >
) {
  return useMutation({
    mutationKey: ['tanent', 'application', 'otp', 'verify'],
    mutationFn: (request: TenantOtpVerifyRequest) => tanentService.verifyOtp(request),
    ...options
  })
}

export function useCompleteTenantApplicationMutation(
  options?: Omit<
    UseMutationOptions<TenantApplicationCompleteResponse, Error, TenantApplicationCompleteRequest>,
    'mutationKey' | 'mutationFn'
  >
) {
  return useMutation({
    mutationKey: ['tanent', 'application', 'complete'],
    mutationFn: (request: TenantApplicationCompleteRequest) => tanentService.completeApplication(request),
    ...options
  })
}

export function useTenantPasswordSetupMutation(
  options?: Omit<
    UseMutationOptions<TenantPasswordSetupResponse, Error, TenantPasswordSetupRequest>,
    'mutationKey' | 'mutationFn'
  >
) {
  return useMutation({
    mutationKey: ['tanent', 'application', 'password-setup'],
    mutationFn: (request: TenantPasswordSetupRequest) => tanentService.setupPassword(request),
    ...options
  })
}
