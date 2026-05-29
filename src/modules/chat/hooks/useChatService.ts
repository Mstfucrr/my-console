import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { chatService, ChatTokenRequest, ChatTokenResponse } from '../service/chat.service'

export function useGetChatTokenQuery(
  params?: ChatTokenRequest,
  options?: Omit<UseQueryOptions<ChatTokenResponse, Error, ChatTokenResponse, string[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['chat', 'token', params?.hubId, params?.orderId].filter(Boolean) as string[],
    queryFn: () => chatService.getChatToken(params),
    ...options
  })
}

export function useInvalidateChatTokenMutation(
  options?: Omit<UseMutationOptions<void, Error, string>, 'mutationKey' | 'mutationFn'>
) {
  return useMutation({
    mutationKey: ['chat', 'token', 'invalidate'],
    mutationFn: (token: string) => chatService.invalidateChatToken(token),
    ...options
  })
}
