import DashboardLayout from '@/components/layout/dashboard-layout';

export default function DashLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  );
}
