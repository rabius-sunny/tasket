'use client';

import { API_BASE_URL } from '@/lib/api';
import { AuthUser } from '@/types';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage or cookie)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Ensure we have the user data with id
      const userData = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        ...data.user
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // Redirect to dashboard after successful login
      window.location.href = '/dashboard';
    } catch (error) {
      throw error;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const userData = await response.json();

      if (!response.ok) {
        throw new Error(userData.error || 'Registration failed');
      }

      // Ensure we have the user data with id
      const userWithId = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        ...userData
      };

      setUser(userWithId);
      localStorage.setItem('user', JSON.stringify(userWithId));

      // Redirect to dashboard after successful registration
      window.location.href = '/dashboard';
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
