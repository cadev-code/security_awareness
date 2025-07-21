import { ReactNode } from 'react';
import { Sidebar } from '@/components';

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-svh w-full flex text-white">
      <Sidebar />
      {children}
    </div>
  );
};
