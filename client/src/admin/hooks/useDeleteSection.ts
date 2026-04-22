import { deleter } from '@/api/queryHelpers';
import { queryClient } from '@/config/queryClient';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface DeleteSectionPayload {
  sectionId: number;
}

export const useDeleteSection = () => {
  return useMutation<
    string,
    AxiosError<{ message: string; error: string }>,
    DeleteSectionPayload
  >({
    mutationFn: (data) => {
      return deleter(`/sections/${data.sectionId}`);
    },
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
};
