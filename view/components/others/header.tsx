'use client';

import { Plus, Search } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAuth } from '../auth/auth-context';
import { Button } from '../ui/button';
import { Dropdown, DropdownItem, DropdownSeparator } from '../ui/dropdown';
import { Input } from '../ui/input';
const Avatar = dynamic(() => import('../ui/avatar').then((mod) => mod.Avatar), {
  ssr: false
});

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className='z-50 sticky top-0 w-full bg-white/75 backdrop-blur-lg shadow-xl border-b border-gray-200/50'>
      <div className='box py-2 flex items-center justify-between'>
        {/* Logo & Brand */}
        <div className='flex items-center gap-4 group'>
          <div className='relative'>
            <div className='size-10 sm:size-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 overflow-hidden'>
              <span className='text-white font-black text-xl tracking-wider drop-shadow-sm animate-pulse group-hover:animate-bounce relative'>
                <span className='inline-block transform transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110'>
                  T
                </span>
              </span>
            </div>
            <div className='absolute -inset-1 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300'></div>
          </div>
          <div className='hidden sm:block'>
            <h1 className='text-3xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent tracking-tight'>
              Tasket
            </h1>
            <p className='text-xs text-gray-500 font-medium tracking-wide'>
              Task Management
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className='flex-1 max-w-2xl mx-4 sm:mx-8'>
          <div className={`relative transition-all duration-300`}>
            <div className='absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 transition-opacity duration-300 group-focus-within:opacity-100'></div>
            <div className='relative'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors duration-200' />
              <Input
                placeholder='Search tasks, boards, workspaces...'
                className='w-full pl-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20! focus:border-blue-500! text-gray-800 placeholder-gray-500 transition-all duration-300 hover:shadow-md'
              />
            </div>
          </div>
        </div>

        {/* Actions & User */}
        <div className='flex items-center gap-3 sm:gap-4'>
          <Dropdown
            position='right'
            trigger={
              <Button className='rounded-full sm:rounded-lg px-2.5 py-2.5 sm:px-4 sm:py-2'>
                <Plus className='size-5 sm:size-4 sm:mr-2' />
                <span className='hidden sm:inline'>Create</span>
              </Button>
            }
          >
            <div className='w-46'>
              <DropdownItem>Create new task</DropdownItem>
              <DropdownItem>Create new board</DropdownItem>
              <DropdownItem>Create new workspace</DropdownItem>
            </div>
          </Dropdown>

          <Dropdown
            position='right'
            trigger={
              <Avatar
                home
                fallback={user?.username}
                alt={user?.username}
                size='md'
                className='ring-2 ring-white shadow-sm bg-[#08e59b] text-white font-semibold text-lg'
              />
            }
          >
            <div className='w-36'>
              <DropdownItem>Profile</DropdownItem>
              <DropdownItem>Settings</DropdownItem>
              <DropdownSeparator />
              <DropdownItem
                onClick={logout}
                variant='danger'
              >
                Sign Out
              </DropdownItem>
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
