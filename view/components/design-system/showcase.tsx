'use client';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const DesignSystemShowcase = () => {
  const colors = [
    { name: 'Primary', class: 'bg-primary-500', textClass: 'text-primary-500' },
    {
      name: 'Secondary',
      class: 'bg-secondary-500',
      textClass: 'text-secondary-500'
    },
    { name: 'Success', class: 'bg-success-500', textClass: 'text-success-500' },
    { name: 'Warning', class: 'bg-warning-500', textClass: 'text-warning-500' },
    { name: 'Error', class: 'bg-error-500', textClass: 'text-error-500' },
    { name: 'Info', class: 'bg-info-500', textClass: 'text-info-500' },
    { name: 'Purple', class: 'bg-purple-500', textClass: 'text-purple-500' }
  ];

  const gradients = [
    { name: 'Primary', class: 'gradient-primary' },
    { name: 'Secondary', class: 'gradient-secondary' },
    { name: 'Success', class: 'gradient-success' },
    { name: 'Warning', class: 'gradient-warning' },
    { name: 'Error', class: 'gradient-error' },
    { name: 'Purple', class: 'gradient-purple' },
    { name: 'Rainbow', class: 'gradient-rainbow' }
  ];

  return (
    <div className='space-y-8 p-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-primary mb-2'>
          Tasket Design System
        </h1>
        <p className='text-secondary'>
          A comprehensive color system for beautiful UI components
        </p>
      </div>

      {/* Color Palette */}
      <Card className='card-interactive'>
        <CardHeader>
          <h2 className='text-xl font-semibold text-primary'>Color Palette</h2>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4'>
            {colors.map((color) => (
              <div
                key={color.name}
                className='text-center'
              >
                <div
                  className={`w-16 h-16 rounded-lg ${color.class} mx-auto mb-2 shadow-custom-md`}
                />
                <p className={`text-sm font-medium ${color.textClass}`}>
                  {color.name}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gradients */}
      <Card className='card-interactive'>
        <CardHeader>
          <h2 className='text-xl font-semibold text-primary'>
            Gradient Collection
          </h2>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4'>
            {gradients.map((gradient) => (
              <div
                key={gradient.name}
                className='text-center'
              >
                <div
                  className={`w-16 h-16 rounded-lg ${gradient.class} mx-auto mb-2 shadow-custom-md`}
                />
                <p className='text-sm font-medium text-primary'>
                  {gradient.name}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <Card className='card-interactive'>
        <CardHeader>
          <h2 className='text-xl font-semibold text-primary'>
            Button Components
          </h2>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex flex-wrap gap-3'>
              <Button variant='primary'>Primary</Button>
              <Button variant='secondary'>Secondary</Button>
              <Button variant='outline'>Outline</Button>
              <Button variant='ghost'>Ghost</Button>
              <Button variant='danger'>Danger</Button>
            </div>
            <div className='flex flex-wrap gap-3'>
              <Button size='sm'>Small</Button>
              <Button size='md'>Medium</Button>
              <Button size='lg'>Large</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card className='card-interactive'>
        <CardHeader>
          <h2 className='text-xl font-semibold text-primary'>
            Badge Components
          </h2>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-3'>
            <Badge variant='default'>Default</Badge>
            <Badge variant='primary'>Primary</Badge>
            <Badge variant='secondary'>Secondary</Badge>
            <Badge variant='success'>Success</Badge>
            <Badge variant='warning'>Warning</Badge>
            <Badge variant='danger'>Danger</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Cards with Effects */}
      <Card className='card-interactive'>
        <CardHeader>
          <h2 className='text-xl font-semibold text-primary'>Card Effects</h2>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div className='p-4 rounded-lg surface-secondary hover-lift'>
              <h3 className='font-medium text-primary mb-2'>Hover Lift</h3>
              <p className='text-sm text-secondary'>
                Hover to see the lift effect
              </p>
            </div>
            <div className='p-4 rounded-lg surface-secondary hover-glow'>
              <h3 className='font-medium text-primary mb-2'>Hover Glow</h3>
              <p className='text-sm text-secondary'>
                Hover to see the glow effect
              </p>
            </div>
            <div
              className='p-4 rounded-lg glass text-white'
              style={{
                background:
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.3))'
              }}
            >
              <h3 className='font-medium mb-2'>Glass Effect</h3>
              <p className='text-sm opacity-90'>Glassmorphism design</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Indicators */}
      <Card className='card-interactive'>
        <CardHeader>
          <h2 className='text-xl font-semibold text-primary'>
            Status Indicators
          </h2>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='p-3 rounded-lg status-success'>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-success rounded-full'></div>
                <span className='text-sm font-medium'>Success Status</span>
              </div>
            </div>
            <div className='p-3 rounded-lg status-warning'>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-warning rounded-full'></div>
                <span className='text-sm font-medium'>Warning Status</span>
              </div>
            </div>
            <div className='p-3 rounded-lg status-error'>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-error rounded-full'></div>
                <span className='text-sm font-medium'>Error Status</span>
              </div>
            </div>
            <div className='p-3 rounded-lg status-info'>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-info rounded-full'></div>
                <span className='text-sm font-medium'>Info Status</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Glowing Elements */}
      <Card className='card-interactive'>
        <CardHeader>
          <h2 className='text-xl font-semibold text-primary'>
            Glowing Effects
          </h2>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='p-4 rounded-lg bg-primary-500 text-white glow-primary'>
              <h3 className='font-medium mb-1'>Primary Glow</h3>
              <p className='text-sm opacity-90'>Soft glowing effect</p>
            </div>
            <div className='p-4 rounded-lg bg-success-500 text-white glow-success'>
              <h3 className='font-medium mb-1'>Success Glow</h3>
              <p className='text-sm opacity-90'>Success glowing effect</p>
            </div>
            <div className='p-4 rounded-lg bg-warning-500 text-white glow-warning'>
              <h3 className='font-medium mb-1'>Warning Glow</h3>
              <p className='text-sm opacity-90'>Warning glowing effect</p>
            </div>
            <div className='p-4 rounded-lg bg-error-500 text-white glow-error'>
              <h3 className='font-medium mb-1'>Error Glow</h3>
              <p className='text-sm opacity-90'>Error glowing effect</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      <Card className='card-interactive'>
        <CardHeader>
          <h2 className='text-xl font-semibold text-primary'>
            Progress Indicators
          </h2>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div>
              <div className='flex justify-between text-sm text-secondary mb-1'>
                <span>Project Progress</span>
                <span>75%</span>
              </div>
              <div className='progress-bar'>
                <div
                  className='progress-fill'
                  style={{ width: '75%' }}
                ></div>
              </div>
            </div>
            <div>
              <div className='flex justify-between text-sm text-secondary mb-1'>
                <span>Task Completion</span>
                <span>45%</span>
              </div>
              <div className='progress-bar'>
                <div
                  className='progress-fill'
                  style={{ width: '45%' }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avatars */}
      <Card className='card-interactive'>
        <CardHeader>
          <h2 className='text-xl font-semibold text-primary'>
            Avatar Components
          </h2>
        </CardHeader>
        <CardContent>
          <div className='flex items-center space-x-4'>
            <Avatar
              fallback='JD'
              size='sm'
            />
            <Avatar
              fallback='AS'
              size='md'
            />
            <Avatar
              fallback='MB'
              size='lg'
            />
            <Avatar
              fallback='TK'
              size='xl'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
