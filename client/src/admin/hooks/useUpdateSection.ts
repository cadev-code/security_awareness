import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { patcher } from '@/api/queryHelpers';
import { queryClient } from '@/config/queryClient';

interface UpdateSectionPayload {
  sectionId: number;
  name: string;
  bg_color: string;
  bg_image?: File;
  subtitle_image?: File;
}

export const useUpdateSection = (onClose: () => void) => {
  return useMutation<string, AxiosError, UpdateSectionPayload>({
    mutationFn: (data) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('bg_color', data.bg_color);
      if (data.bg_image) {
        formData.append('bg_file', data.bg_image);
      }
      if (data.subtitle_image) {
        formData.append('subtitle_file', data.subtitle_image);
      }

      return patcher(`/sections/${data.sectionId}`, formData);
    },
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      onClose();
    },
  });
};
