import { useMemo } from 'react';

export const useAvatar = (userId: string | undefined) => {
  return useMemo(() => {
    if (!userId) return '/avatars/avatar1.png';
    
    // Convert userId to a number for consistent avatar selection
    const hash = userId.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    // Use modulo to get a number between 1 and 8
    const avatarNumber = (hash % 8) + 1;
    
    return `/avatars/avatar${avatarNumber}.png`;
  }, [userId]);
};

export default useAvatar; 