'use client';

import Header from '../others/header';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col'>
      {/* header  */}
      <Header />
      {/* Main Content */}
      <main className='bg-white/90 rounded-2xl shadow-lg min-h-[60vh]'>
        {children}
      </main>
    </div>
  );
}
