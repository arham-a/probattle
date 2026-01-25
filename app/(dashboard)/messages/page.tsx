'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@heroui/card';
import { Spinner } from '@heroui/spinner';
import { Badge } from '@heroui/badge';
import ConversationList from '@/components/messaging/ConversationList';
import ChatWindow from '@/components/messaging/ChatWindow';
import { getConversations, getUnreadCount } from '@/lib/api/messages';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api/config';

export default function MessagesPage() {
  const { user, token } = useAuth();
  const searchParams = useSearchParams();
  const userIdParam = searchParams?.get('userId');
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      loadConversations();
      loadUnreadCount();
      
      // If userId is in URL, select that conversation
      if (userIdParam) {
        const userId = userIdParam; // Keep as string
        setSelectedUserId(userId);
        loadUserDetails(userId);
      }
      
      // Refresh conversations every 30 seconds
      const interval = setInterval(() => {
        loadConversations();
        loadUnreadCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user, token, userIdParam]);

  const loadUserDetails = async (userId: string) => {
    try {
      // Fetch user details from API
      const response = await apiClient.get(`/users/${userId}`);
      setSelectedUser({
        id: response.data.id,
        name: response.data.name,
        profilePicture: response.data.profilePicture,
      });
    } catch (error) {
      console.error('Error loading user details:', error);
    }
  };

  const loadConversations = async () => {
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleSelectConversation = (userId: string) => {
    setSelectedUserId(userId);
    setSelectedUser(null); // Will be loaded from conversations
    // Refresh conversations to update unread count
    setTimeout(() => loadConversations(), 500);
  };

  const selectedConversation = conversations.find(
    (conv) => conv.otherUser.id === selectedUserId
  );

  // If user is selected but not in conversations, use the loaded user details
  const displayUser = selectedConversation?.otherUser || selectedUser;

  if (!user || !token) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please log in to view messages</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 h-screen">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Messages</h1>
          {unreadCount > 0 && (
            <Badge color="danger" content={unreadCount} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-120px)]">
        {/* Conversations List */}
        <Card className="md:col-span-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b flex-shrink-0">
            <h2 className="font-semibold">Conversations</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Spinner />
              </div>
            ) : (
              <ConversationList
                conversations={conversations}
                currentUserId={user.id}
                selectedUserId={selectedUserId || undefined}
                onSelectConversation={handleSelectConversation}
              />
            )}
          </div>
        </Card>

        {/* Chat Window */}
        <div className="md:col-span-2">
          {displayUser ? (
            <ChatWindow
              currentUserId={user.id}
              otherUser={displayUser}
              token={token}
              onClose={() => {
                setSelectedUserId(null);
                setSelectedUser(null);
              }}
            />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="text-lg mb-2">Select a conversation</p>
                <p className="text-sm">Choose a conversation from the list to start messaging</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
