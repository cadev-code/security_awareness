import { AxiosError } from 'axios';
import { fetcher } from '@/api/queryHelpers';
import { useQuery } from '@tanstack/react-query';

import { Chapter } from '@/types/chapter.types';

export const useChaptersBySection = (sectionId: number) => {
  return useQuery<Chapter[], AxiosError>({
    queryKey: ['chapters-by-section', sectionId],
    queryFn: () => fetcher<Chapter[]>(`/chapters/${sectionId}`),
    retry: false,
    staleTime: 1000 * 30, // 5 minutes
  });
};
