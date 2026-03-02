// src/modules/chat/service/chat.service.ts
import { privateAxiosInstance } from '@/lib/axios/instances'

export interface ChatTokenResponse {
  token: string
  expiresIn: number
  expiresAt: string
}

export interface ChatTokenRequest {
  orderId?: string
  hubId?: string
}

class ChatService {
  async getChatToken(params?: ChatTokenRequest): Promise<ChatTokenResponse> {
    const { data } = await privateAxiosInstance.post<ChatTokenResponse>('/chat/token', params)
    return data
  }

  async invalidateChatToken(token: string): Promise<void> {
    await privateAxiosInstance.delete(`/chat/token/${token}`)
  }
}

const chatService = new ChatService()

export { chatService }
