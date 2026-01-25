'use client';

import { Avatar } from '@heroui/avatar';
import { Badge } from '@heroui/badge';
import { Card } from '@heroui/card';
import { formatDistanceToNow } from '@/lib/utils/date';

interface Conversation {
  otherUser: {
    id: number;
    name: string;
    email: string;
    profilePicture?: string;
  };
  lastMessage: {
    message: string;
    senderId: number;
    createdAt: Date;
  };
  unreadCount: number;
  isOnline: boolean;
}

interface ConversationListProps {
  conversations: Conversation[];
  currentUserId: string;
  selectedUserId?: string;
  onSelectConversation: (userId: string) => void;
}

export default function ConversationList({
  conversations,
  currentUserId,
  selectedUserId,
  onSelectConversation,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 p-4">
        <p className="text-center">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full p-2">
      {conversations.map((conversation) => {
        const isSelected = selectedUserId === conversation.otherUser.id;
        const isOwnMessage = conversation.lastMessage.senderId === currentUserId;
        
        return (
          <Card
            key={conversation.otherUser.id}
            isPressable
            onPress={() => onSelectConversation(conversation.otherUser.id.toString())}
            className={`mb-2 ${isSelected ? 'bg-primary-50 border-primary' : ''}`}
          >
            <div className="flex items-center gap-3 p-4">
              <div className="relative flex-shrink-0">
                <Avatar
                  src={conversation.otherUser.profilePicture}
                  name={conversation.otherUser.name}
                  size="md"
                />
                {conversation.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-base truncate flex-1">
                    {conversation.otherUser.name}
                  </h3>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatDistanceToNow(new Date(conversation.lastMessage.createdAt))}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-gray-600 truncate flex-1">
                    {isOwnMessage && 'You: '}
                    {conversation.lastMessage.message}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <Badge color="primary" content={conversation.unreadCount} size="sm" className="flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
