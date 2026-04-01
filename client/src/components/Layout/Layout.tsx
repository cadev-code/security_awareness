import { ReactNode } from 'react';
import { Sidebar } from '@/components';
import { useLocation } from 'react-router';

export const Layout = ({ children }: { children: ReactNode }) => {
  const path = useLocation();

  if (path.pathname.startsWith('/protected')) {
    return <div className="bg-white w-full h-screen">{children}</div>;
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
