import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { poster } from '@/api/queryHelpers';

interface AddChapterPayload {
  sectionId: number;
  name: string;
  availability: Date;
  questions_url: string;
  cover_image: File;
  file: File;
}

export const useAddChapter = (onClose: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<
    string,
    AxiosError<{ message: string; error: string }>,
    AddChapterPayload
  >({
    mutationFn: (data) => {
      const extFile = data.file.name.split('.').pop()?.toLowerCase();

      const type_file =
        extFile === 'jpg' || extFile === 'jpeg' || extFile === 'png'
          ? 'IMAGE'
          : extFile === 'mp4'
            ? 'VIDEO'
            : extFile === 'mp3'
              ? 'AUDIO'
              : undefined;

      if (!type_file) {
        throw new Error('Unsupported file type');
      }

      const formData = new FormData();
      formData.append('sectionId', data.sectionId.toString());
      formData.append('name', data.name);
      formData.append('file_type', type_file);
      formData.append('availability', data.availability.toISOString());
      formData.append('cover_file', data.cover_image);
      formData.append('chapter_file', data.file);

      if (data.questions_url !== '') {
        formData.append('questions_url', data.questions_url);
      }

      return poster('/chapters', formData);
    },
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters-by-section'] });
      onClose();
    },
  });
};
