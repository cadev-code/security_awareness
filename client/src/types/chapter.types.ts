export interface Chapter {
  id: number;
  section_id: number;
  name: string;
  showName: boolean;
  cover_url: string;
  file_url: string;
  file_type: 'VIDEO' | 'IMAGE' | 'AUDIO';
  availability: Date;
}
