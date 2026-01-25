'use client';

import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';

interface StartConversationButtonProps {
  userId: string;
  userName: string;
  variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function StartConversationButton({
  userId,
  userName,
  variant = 'solid',
  size = 'md',
  className = '',
}: StartConversationButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    // Navigate to messages page with the user selected
    router.push(`/messages?userId=${userId}`);
  };

  return (
    <Button
      color="primary"
      variant={variant}
      size={size}
      onClick={handleClick}
      className={className}
    >
      Message {userName}
    </Button>
  );
}
