'use client';

import { useState, useEffect } from 'react';
import { Card } from '@heroui/card';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Spinner } from '@heroui/spinner';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useWebSocket } from '@/hooks/useWebSocket';
import { getConversation, markMessageAsRead } from '@/lib/api/messages';

interface ChatWindowProps {
  currentUserId: string;
  otherUser: {
    id: string;
    name: string;
    profilePicture?: string;
  };
  token: string;
  onClose?: () => void;
}

export default function ChatWindow({ 
  currentUserId, 
  otherUser, 
  token,
  onClose 
}: ChatWindowProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [page, setPage] = useState(1);

  // Only initialize WebSocket if token exists
  const websocketEnabled = !!token;

  const {
    isConnected,
    sendMessage,
    sendTypingIndicator,
    markMessageAsRead: markAsRead,
  } = useWebSocket(websocketEnabled ? token : null, {
    onNewMessage: (message) => {
      console.log('WebSocket: New message received', message);
      if (
        (message.senderId === otherUser.id && message.receiverId === currentUserId) ||
        (message.senderId === currentUserId && message.receiverId === otherUser.id)
      ) {
        // Check if message already exists (to avoid duplicates from optimistic updates)
        setMessages((prev) => {
          const exists = prev.some(msg => 
            msg.id === message.id || 
            (msg.tempId && msg.message === message.message && msg.senderId === message.senderId)
          );
          if (exists) {
            // Update the temporary message with the real one
            return prev.map(msg => 
              msg.tempId && msg.message === message.message && msg.senderId === message.senderId
                ? message
                : msg
            );
          }
          return [...prev, message];
        });
        
        // Mark as read if it's from the other user
        if (message.senderId === otherUser.id) {
          markAsRead(message.id, message.senderId);
        }
      }
    },
    onMessageSent: (data) => {
      console.log('WebSocket: Message sent confirmation', data);
      // Update the temporary message with the real ID
      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId ? { ...msg, id: data.messageId, tempId: undefined } : msg
        )
      );
    },
    onMessageRead: (data) => {
      console.log('WebSocket: Message read', data);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId ? { ...msg, read: true, readAt: data.readAt } : msg
        )
      );
    },
    onUserTyping: (data) => {
      if (data.userId === otherUser.id) {
        setIsTyping(data.isTyping);
      }
    },
  });

  useEffect(() => {
    loadMessages();
  }, [otherUser.id]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      console.log('Loading messages for user:', otherUser.id);
      const response = await getConversation(otherUser.id, page, 50);
      console.log('Messages loaded:', response);
      setMessages(response.messages);
    } catch (error) {
      console.error('Error loading messages:', error);
      // Set empty array on error so UI shows "no messages"
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (message: string) => {
    if (isConnected) {
      // Optimistically add message to local state
      const tempMessage = {
        tempId: `temp-${Date.now()}`,
        id: 0, // Will be updated when we get confirmation
        senderId: currentUserId,
        receiverId: otherUser.id,
        message,
        timestamp: new Date(),
        read: false,
      };
      
      setMessages((prev) => [...prev, tempMessage]);
      
      // Send via WebSocket
      sendMessage(otherUser.id, message);
    } else {
      console.error('WebSocket not connected');
    }
  };

  const handleTyping = (typing: boolean) => {
    if (isConnected) {
      sendTypingIndicator(otherUser.id, typing);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar
            src={otherUser.profilePicture}
            name={otherUser.name}
            size="md"
          />
          <div>
            <h2 className="font-semibold">{otherUser.name}</h2>
            <p className="text-xs text-gray-500">
              {isConnected ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        {onClose && (
          <Button
            isIconOnly
            variant="light"
            onClick={onClose}
          >
            ✕
          </Button>
        )}
      </div>

      {/* Messages */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          isTyping={isTyping}
          typingUserName={otherUser.name}
        />
      )}

      {/* Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        disabled={!isConnected}
        placeholder={`Message ${otherUser.name}...`}
      />
    </Card>
  );
}
