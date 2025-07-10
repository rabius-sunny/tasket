import { AuthProvider } from '@/components/auth/auth-context';
import { SWRProvider } from '@/lib/swr-provider';
import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const raleway = Raleway({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tasket - Task Management Platform',
  description: 'A powerful task management and collaboration platform'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        suppressHydrationWarning
        className={raleway.className}
      >
        <SWRProvider>
          <AuthProvider>{children}</AuthProvider>
        </SWRProvider>
        <Toaster closeButton />
      </body>
    </html>
  );
}
