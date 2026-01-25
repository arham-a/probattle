'use client';

import { useEffect, useRef } from 'react';
import { Avatar } from '@heroui/avatar';
import { formatDistanceToNow } from '@/lib/utils/date';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  createdAt: Date;
  read: boolean;
  sender?: {
    id: number;
    name: string;
    profilePicture?: string;
  };
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isTyping?: boolean;
  typingUserName?: string;
}

export default function MessageList({ 
  messages, 
  currentUserId, 
  isTyping, 
  typingUserName 
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((message) => {
          const isOwnMessage = message.senderId === currentUserId;
          
          return (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {!isOwnMessage && message.sender && (
                <Avatar
                  src={message.sender.profilePicture}
                  name={message.sender.name}
                  size="sm"
                  className="flex-shrink-0"
                />
              )}
              
              <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    isOwnMessage
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                </div>
                
                <div className="flex items-center gap-2 mt-1 px-2">
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(message.createdAt))}
                  </span>
                  {isOwnMessage && (
                    <span className="text-xs text-gray-500">
                      {message.read ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
      
      {isTyping && (
        <div className="flex items-end gap-2">
          <Avatar size="sm" className="flex-shrink-0" />
          <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-2">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
