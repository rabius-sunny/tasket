'use client';

import requests from '@/lib/http';
import { AuthUser } from '@/types';
import { deleteCookie, setCookie } from '@/utils/cookie';
import { decrypt } from '@/utils/string';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';
import message from '../ui/message';

interface AuthContextType {
  user: AuthUser | null;
  authenticate: (
    type: 'login' | 'register',
    email: string,
    password: string,
    username?: string
  ) => Promise<void>;
  logout: () => void;
  authLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const searchParams = useSearchParams();
  const { push } = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const authenticate = async (
    type: 'login' | 'register',
    email: string,
    password: string,
    username?: string
  ) => {
    try {
      setAuthLoading(true);
      const data = await requests.post(`/auth/${type}`, {
        email,
        password,
        username
      });

      if (!data.token) {
        throw new Error(data.error || type + ' failed');
      }

      const newUser = {
        id: data.id,
        username: data.username,
        email: data.email
      };
      setUser(newUser);
      setCookie('token', data.token, 7);
      localStorage.setItem('user', JSON.stringify(newUser));

      let redirectTo = '/dashboard/workspace';

      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        const decryptedUrl = await decrypt(redirectUrl);
        redirectTo = (decryptedUrl as string) || '/dashboard/workspace';
      }

      push(redirectTo);
    } catch (error: any) {
      message.error(error?.message || type + ' failed');
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    deleteCookie('token');
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, authenticate, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
