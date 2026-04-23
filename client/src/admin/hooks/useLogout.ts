import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { poster } from '@/api/queryHelpers';
import { useNavigate } from 'react-router';

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<string, AxiosError<{ message: string; error: string }>>({
    mutationFn: () => poster('/auth/logout'),
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['currentUser'] });
      navigate('/admin/auth/login');
    },
  });
};
