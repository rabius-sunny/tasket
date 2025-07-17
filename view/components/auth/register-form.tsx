'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import message from '../ui/message';
import { useAuth } from './auth-context';

interface RegisterFormProps {
  onToggleMode: () => void;
}

export const RegisterForm = ({ onToggleMode }: RegisterFormProps) => {
  const { authenticate, authLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    await authenticate('register', email, password, username);
  };

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <h2 className='text-2xl font-bold text-center text-gray-900'>
          Sign Up
        </h2>
        <p className='text-center text-gray-600'>Create your Tasket account</p>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className='space-y-4'
        >
          <Input
            type='text'
            label='Username'
            value={username}
            onBlur={(e) => setUsername(e.target.value)}
            placeholder='Enter your username'
            required
          />
          <Input
            type='email'
            label='Email'
            value={email}
            onBlur={(e) => setEmail(e.target.value)}
            placeholder='Enter your email'
            required
          />
          <Input
            type='password'
            label='Password'
            value={password}
            onBlur={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
            required
          />
          <Input
            type='password'
            label='Confirm Password'
            value={confirmPassword}
            onBlur={(e) => setConfirmPassword(e.target.value)}
            placeholder='Confirm your password'
            required
          />

          <Button
            type='submit'
            className='w-full'
            isLoading={authLoading}
            disabled={authLoading}
          >
            Sign Up
          </Button>
        </form>

        <div className='mt-6 text-center'>
          <button
            type='button'
            onClick={onToggleMode}
            className='text-blue-600 hover:text-blue-800 text-sm'
          >
            Already have an account? Sign in
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
