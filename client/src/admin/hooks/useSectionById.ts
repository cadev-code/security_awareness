import { AxiosError } from 'axios';
import { fetcher } from '@/api/queryHelpers';
import { useQuery } from '@tanstack/react-query';
import { Section } from '@/types/section.types';

export const useSectionById = (sectionId: number) => {
  return useQuery<Section, AxiosError>({
    queryKey: ['section-by-id', sectionId],
    queryFn: () => fetcher<Section>(`/sections/${sectionId}`),
    retry: false,
    staleTime: 1000 * 30, // 5 minutes
  });
};
