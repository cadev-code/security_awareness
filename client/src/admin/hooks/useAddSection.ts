import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { poster } from '@/api/queryHelpers';

interface AddSectionPayload {
  name: string;
  bg_color: string;
  bg_image: File;
  subtitle_image: File;
}

export const useAddSection = (onClose: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<
    string,
    AxiosError<{ message: string; error: string }>,
    AddSectionPayload
  >({
    mutationFn: (data) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('bg_color', data.bg_color);
      formData.append('bg_file', data.bg_image);
      formData.append('subtitle_file', data.subtitle_image);

      return poster('/sections', formData);
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
