import { fetcher } from '@/api/queryHelpers';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface Auth {
  sub: number;
  username: string;
  iat: number;
  exp: number;
}

export const useCurrentUser = () => {
  return useQuery<Auth, AxiosError<{ message: string; error: string }>>({
    queryKey: ['currentUser'],
    queryFn: () => fetcher<Auth>('/auth/profile'),
    retry: false,
    staleTime: 1000 * 30, // 5 minutes
  });
};
