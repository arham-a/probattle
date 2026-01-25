import { io, Socket } from 'socket.io-client';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  conversationId?: string;
  timestamp: Date;
  read: boolean;
}

interface MessageCallbacks {
  onNewMessage?: (message: Message) => void;
  onMessageSent?: (data: { messageId: number; timestamp: Date }) => void;
  onMessageRead?: (data: { messageId: number; readBy: number; readAt: Date }) => void;
  onUserTyping?: (data: { userId: number; isTyping: boolean }) => void;
  onError?: (error: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

class WebSocketService {
  private socket: Socket | null = null;
  private callbacks: MessageCallbacks = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Initialize WebSocket connection
   */
  connect(token: string, callbacks?: MessageCallbacks): void {
    if (this.socket?.connected) {
      console.log('WebSocket already connected');
      return;
    }

    this.callbacks = callbacks || {};

    // Get API URL from environment or default to localhost
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    this.socket = io(apiUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventListeners();
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      this.reconnectAttempts = 0;
      this.callbacks.onConnect?.();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('⚠️ WebSocket disconnected:', reason);
      this.callbacks.onDisconnect?.();
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.callbacks.onError?.('Failed to connect to messaging server');
      }
    });

    // Message events
    this.socket.on('new_message', (message: Message) => {
      console.log('📨 New message received:', message);
      this.callbacks.onNewMessage?.(message);
    });

    this.socket.on('message_sent', (data) => {
      console.log('✅ Message sent confirmation:', data);
      this.callbacks.onMessageSent?.(data);
    });

    this.socket.on('message_read', (data) => {
      console.log('👁️ Message read:', data);
      this.callbacks.onMessageRead?.(data);
    });

    this.socket.on('user_typing', (data) => {
      this.callbacks.onUserTyping?.(data);
    });

    this.socket.on('error', (error) => {
      console.error('❌ WebSocket error:', error);
      this.callbacks.onError?.(error.message);
    });
  }

  /**
   * Send a message
   */
  sendMessage(receiverId: number, message: string, conversationId?: string): void {
    if (!this.socket?.connected) {
      console.error('WebSocket not connected');
      this.callbacks.onError?.('Not connected to messaging server');
      return;
    }

    this.socket.emit('send_message', {
      receiverId,
      message,
      conversationId,
    });
  }

  /**
   * Send typing indicator
   */
  sendTypingIndicator(receiverId: number, isTyping: boolean): void {
    if (!this.socket?.connected) return;

    this.socket.emit('typing', {
      receiverId,
      isTyping,
    });
  }

  /**
   * Mark message as read
   */
  markMessageAsRead(messageId: number, senderId: number): void {
    if (!this.socket?.connected) return;

    this.socket.emit('message_read', {
      messageId,
      senderId,
    });
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('WebSocket disconnected');
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Update callbacks
   */
  updateCallbacks(callbacks: MessageCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();

// Export types
export type { Message, MessageCallbacks };
