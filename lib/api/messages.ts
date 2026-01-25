import { apiClient } from './config';

export interface Message {
  id: number;
  senderId: string;
  receiverId: string;
  message: string;
  conversationId?: string;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  sender?: {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  receiver?: {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
}

export interface Conversation {
  otherUser: {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  lastMessage: Message;
  lastMessageAt: Date;
  unreadCount: number;
  isOnline: boolean;
}

export interface ConversationResponse {
  messages: Message[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get all conversations for the current user
 */
export async function getConversations(): Promise<Conversation[]> {
  const response = await apiClient.get('/messages/conversations');
  return response.data;
}

/**
 * Get conversation with a specific user
 */
export async function getConversation(
  otherUserId: string,
  page: number = 1,
  limit: number = 50
): Promise<ConversationResponse> {
  const response = await apiClient.get(`/messages/conversation/${otherUserId}`, {
    params: { page, limit },
  });
  return response.data;
}

/**
 * Mark a message as read
 */
export async function markMessageAsRead(messageId: number): Promise<{ success: boolean; message: Message }> {
  const response = await apiClient.post(`/messages/read/${messageId}`);
  return response.data;
}

/**
 * Get unread message count
 */
export async function getUnreadCount(): Promise<{ count: number }> {
  const response = await apiClient.get('/messages/unread-count');
  return response.data;
}
