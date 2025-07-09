import { JSX, Show, createSignal } from 'solid-js';
import { A, useLocation } from '@solidjs/router';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  User
} from 'lucide-react';
import { Dropdown, DropdownItem, DropdownDivider } from './Dropdown';
import Button from './Button';

interface LayoutProps {
  children: JSX.Element;
}

export default function Layout(props: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Workspaces', href: '/workspaces', icon: FolderKanban },
    { name: 'My Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div class='min-h-screen bg-gray-50'>
      {/* Mobile sidebar backdrop */}
      <Show when={sidebarOpen()}>
        <div
          class='fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      </Show>

      {/* Sidebar */}
      <div
        class={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen() ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div class='flex items-center justify-between h-16 px-6 border-b border-gray-200'>
          <div class='flex items-center'>
            <div class='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
              <span class='text-white font-bold text-lg'>T</span>
            </div>
            <span class='ml-3 text-xl font-semibold text-gray-900'>Tasket</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            class='lg:hidden text-gray-500 hover:text-gray-700'
          >
            <X class='w-6 h-6' />
          </button>
        </div>

        <nav class='mt-6 px-3'>
          <div class='space-y-1'>
            {navigation.map((item) => (
              <A
                href={item.href}
                class={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  class={`mr-3 h-5 w-5 ${
                    isActive(item.href)
                      ? 'text-blue-700'
                      : 'text-gray-500 group-hover:text-gray-700'
                  }`}
                />
                {item.name}
              </A>
            ))}
          </div>
        </nav>

        {/* Bottom section */}
        <div class='absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200'>
          <div class='bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4'>
            <h4 class='text-white font-semibold'>Upgrade to Pro</h4>
            <p class='text-blue-100 text-sm mt-1'>
              Get unlimited workspaces and advanced features
            </p>
            <Button
              variant='outline'
              size='sm'
              class='mt-2 bg-white text-blue-600 border-white hover:bg-blue-50'
            >
              Upgrade
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div class='lg:pl-64'>
        {/* Top header */}
        <header class='bg-white shadow-sm border-b border-gray-200'>
          <div class='flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8'>
            <div class='flex items-center'>
              <button
                onClick={() => setSidebarOpen(true)}
                class='lg:hidden text-gray-500 hover:text-gray-700 mr-4'
              >
                <Menu class='w-6 h-6' />
              </button>

              {/* Search bar */}
              <div class='relative max-w-md w-full'>
                <div class='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Search class='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='text'
                  placeholder='Search tasks, boards, workspaces...'
                  class='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
            </div>

            <div class='flex items-center space-x-4'>
              {/* Notifications */}
              <button class='relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg'>
                <Bell class='w-5 h-5' />
                <span class='absolute top-1 right-1 block h-2 w-2 bg-red-500 rounded-full'></span>
              </button>

              {/* User menu */}
              <Dropdown
                trigger={
                  <button class='flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg'>
                    <div class='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center'>
                      <User class='w-5 h-5 text-gray-600' />
                    </div>
                    <span class='hidden md:block text-sm font-medium'>
                      John Doe
                    </span>
                  </button>
                }
                align='right'
              >
                <DropdownItem>Your Profile</DropdownItem>
                <DropdownItem>Settings</DropdownItem>
                <DropdownDivider />
                <DropdownItem>Sign out</DropdownItem>
              </Dropdown>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main class='flex-1 p-4 sm:p-6 lg:p-8'>{props.children}</main>
      </div>
    </div>
  );
}
