import { useLogout } from '@/admin/hooks/useLogout';
import { Button } from '@/components/ui/button';
import { LucideLogOut } from 'lucide-react';

export const LogoutBtn = () => {
  const logout = useLogout();

  return (
    <div className="flex justify-end items-center">
      <Button variant="link" onClick={() => logout.mutate()}>
        Cerrar sesión
        <LucideLogOut className="text-red-500" size={16} />
      </Button>
    </div>
  );
};
