'use client';

import { useAuth } from '@/components/auth/auth-context';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Users,
  X
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';
const Avatar = dynamic(() => import('../ui/avatar').then((mod) => mod.Avatar), {
  ssr: false
});

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Workspaces', icon: Users, href: '/dashboard/workspaces' },
    { name: 'Settings', icon: Settings, href: '/settings' }
  ];

  return (
    <div className='h-screen flex bg-gray-50'>
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className='flex items-center justify-between h-16 px-4 border-b border-gray-200'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>T</span>
              </div>
            </div>
            <div className='ml-2'>
              <h1 className='text-xl font-bold text-gray-900'>Tasket</h1>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className='lg:hidden'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        <nav className='mt-8'>
          <div className='px-4 space-y-2'>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === item.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <item.icon className='mr-3 h-5 w-5' />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200'>
          <div className='flex items-center space-x-3'>
            <Avatar
              fallback={user?.username}
              alt={user?.username}
              size='sm'
            />
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-gray-900 truncate'>
                {user?.username}
              </p>
              <p className='text-xs text-gray-500 truncate'>{user?.email}</p>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={logout}
              className='p-2'
            >
              <LogOut className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Top bar */}
        <div className='bg-white h-20 shadow-lg border-b border-gray-200 px-4 py-4 lg:px-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <button
                onClick={() => setSidebarOpen(true)}
                className='lg:hidden'
              >
                <Menu className='h-6 w-6' />
              </button>
              <div className='ml-4 lg:ml-0'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                  <input
                    type='text'
                    placeholder='Search tasks, boards, workspaces...'
                    className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Button
                size='sm'
                className='flex items-center space-x-2'
              >
                <Plus className='h-4 w-4' />
                <span>Create</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className='flex-1 overflow-y-auto'>
          <div className=''>{children}</div>
        </main>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black/60  z-40 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
