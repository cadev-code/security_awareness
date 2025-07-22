import { ReactNode } from 'react';
import { Sidebar } from '@/components';

export const Layout = ({ children }: { children: ReactNode }) => {
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
