'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useAuth } from './auth-context';

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm = ({ onToggleMode }: LoginFormProps) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <h2 className='text-2xl font-bold text-center text-gray-900'>
          Sign In
        </h2>
        <p className='text-center text-gray-600'>Welcome back to Tasket</p>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className='space-y-4'
        >
          <Input
            type='email'
            label='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email'
            required
          />
          <Input
            type='password'
            label='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
            required
          />

          {error && (
            <div className='text-red-600 text-sm text-center'>{error}</div>
          )}

          <Button
            type='submit'
            className='w-full'
            isLoading={isLoading}
            disabled={isLoading}
          >
            Sign In
          </Button>
        </form>

        <div className='mt-6 text-center'>
          <button
            type='button'
            onClick={onToggleMode}
            className='text-blue-600 hover:text-blue-800 text-sm'
          >
            Don&apos;t have an account? Sign up
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
