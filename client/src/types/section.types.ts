export interface Section {
  id: number;
  name: string;
  bg_url: string;
  bg_color: string;
  flag_url: string;
}

export interface SectionResponse {
  data: Section[];
}
