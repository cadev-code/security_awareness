export interface Section {
  id: number;
  name: string;
  slug: string;
  icon: string;
  type: 'video' | 'podcast' | 'newsletter' | 'custom';
  layout: 'grid' | 'flex';
  card_style: 'default' | 'date-badge' | 'wide';
  bg_image: string | null;
  section_logo: string | null;
  color_theme: string;
  items_per_page: number | null;
  sort_order: number;
  visible: number;
}

export interface ContentItem {
  id: number;
  section_id: number;
  title: string | null;
  filename: string;
  cover: string | null;
  availability: string;
  url_questions: string;
  content_type: 'video' | 'audio' | 'image' | 'pdf';
  sort_order: number;
  visible: number;
}
