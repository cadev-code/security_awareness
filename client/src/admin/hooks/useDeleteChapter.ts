import { deleter } from '@/api/queryHelpers';
import { queryClient } from '@/config/queryClient';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface DeleteChapterPayload {
  chapterId: number;
}

export const useDeleteChapter = () => {
  return useMutation<
    string,
    AxiosError<{ message: string; error: string }>,
    DeleteChapterPayload
  >({
    mutationFn: (data) => {
      return deleter(`/chapters/${data.chapterId}`);
    },
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters-by-section'] });
    },
  });
};
