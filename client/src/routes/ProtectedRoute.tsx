import { JSX } from 'react';
import { Navigate } from 'react-router';
import { useCurrentUser } from '@/admin/hooks/useCurrentUser';
import { Loader2 } from 'lucide-react';

interface Props {
  element: JSX.Element;
}

export const ProtectedRoute = ({ element }: Props) => {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="w-[100vw] h-[100vh] bg-white flex items-center justify-center text-gray-600">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/admin/auth/login" replace />;
  }

  return element;
};
