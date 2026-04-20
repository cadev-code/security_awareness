import { fetcher } from '@/api/queryHelpers';
import { Section } from '@/types/section.types';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useSections = () => {
  return useQuery<Section[], AxiosError>({
    queryKey: ['sections'],
    queryFn: () => fetcher<Section[]>('/sections'),
    retry: false,
    staleTime: 1000 * 30, // 5 minutes
  });
};
