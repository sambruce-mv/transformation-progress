import React, { createContext, useContext, useState, ReactNode } from 'react';
import { user } from '../data/mockData';

export type UserTier = 'L1' | 'L3' | 'L3L4';

interface UserContextType {
  userTier: UserTier;
  setUserTier: (tier: UserTier) => void;
  isSubscriber: boolean;
  userName: string;
  userAvatar: string | number | object;
  dayStreak: number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [userTier, setUserTier] = useState<UserTier>('L1');

  const value: UserContextType = {
    userTier,
    setUserTier,
    isSubscriber: userTier === 'L3' || userTier === 'L3L4',
    userName: 'Naresh',
    userAvatar: user.avatar,
    dayStreak: 0,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserContext;
