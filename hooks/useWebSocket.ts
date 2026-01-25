import { useEffect, useRef, useState } from 'react';
import { websocketService, Message, MessageCallbacks } from '@/lib/websocket';

interface UseWebSocketOptions {
  onNewMessage?: (message: Message) => void;
  onMessageSent?: (data: { messageId: number; timestamp: Date }) => void;
  onMessageRead?: (data: { messageId: number; readBy: number; readAt: Date }) => void;
  onUserTyping?: (data: { userId: number; isTyping: boolean }) => void;
  onError?: (error: string) => void;
}

export function useWebSocket(token: string | null, options?: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!token || hasInitialized.current) return;

    const callbacks: MessageCallbacks = {
      onConnect: () => {
        setIsConnected(true);
        setError(null);
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onError: (err) => {
        setError(err);
        options?.onError?.(err);
      },
      onNewMessage: options?.onNewMessage,
      onMessageSent: options?.onMessageSent,
      onMessageRead: options?.onMessageRead,
      onUserTyping: options?.onUserTyping,
    };

    websocketService.connect(token, callbacks);
    hasInitialized.current = true;

    return () => {
      websocketService.disconnect();
      hasInitialized.current = false;
    };
  }, [token]);

  // Update callbacks when they change
  useEffect(() => {
    if (options) {
      websocketService.updateCallbacks({
        onNewMessage: options.onNewMessage,
        onMessageSent: options.onMessageSent,
        onMessageRead: options.onMessageRead,
        onUserTyping: options.onUserTyping,
        onError: (err) => {
          setError(err);
          options.onError?.(err);
        },
      });
    }
  }, [options]);

  const sendMessage = (receiverId: number, message: string, conversationId?: string) => {
    websocketService.sendMessage(receiverId, message, conversationId);
  };

  const sendTypingIndicator = (receiverId: number, isTyping: boolean) => {
    websocketService.sendTypingIndicator(receiverId, isTyping);
  };

  const markMessageAsRead = (messageId: number, senderId: number) => {
    websocketService.markMessageAsRead(messageId, senderId);
  };

  return {
    isConnected,
    error,
    sendMessage,
    sendTypingIndicator,
    markMessageAsRead,
  };
}
