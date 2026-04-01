import { ReactNode } from 'react';
import { useLocation } from 'react-router';
import { Sidebar } from '@/components';

export const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div
      className="min-h-screen w-full flex text-white"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Sidebar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
};
