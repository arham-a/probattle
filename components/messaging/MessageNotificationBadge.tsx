'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@heroui/badge';
import { getUnreadCount } from '@/lib/api/messages';
import { useAuth } from '@/contexts/AuthContext';
import { useWebSocket } from '@/hooks/useWebSocket';

interface MessageNotificationBadgeProps {
  children: React.ReactNode;
}

export default function MessageNotificationBadge({ children }: MessageNotificationBadgeProps) {
  const { token } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // Connect to WebSocket to get real-time updates
  useWebSocket(token, {
    onNewMessage: () => {
      // Refresh unread count when new message arrives
      loadUnreadCount();
    },
    onMessageRead: () => {
      // Refresh unread count when message is read
      loadUnreadCount();
    },
  });

  useEffect(() => {
    if (token) {
      loadUnreadCount();
      
      // Refresh every minute
      const interval = setInterval(loadUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const loadUnreadCount = async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  if (unreadCount === 0) {
    return <>{children}</>;
  }

  return (
    <Badge content={unreadCount} color="danger" size="sm">
      {children}
    </Badge>
  );
}
