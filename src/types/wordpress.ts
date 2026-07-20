export interface WordPressRendered {
  rendered: string;
}

export interface WordPressMedia {
  source_url?: string;
  alt_text?: string;
  media_details?: {
    width?: number;
    height?: number;
  };
}

export interface WordPressTerm {
  id: number;
  name: string;
  slug: string;
  link?: string;
}

export interface WordPressContentItem {
  id: number;
  slug: string;
  link: string;
  date?: string;
  modified?: string;
  title: WordPressRendered;
  excerpt?: WordPressRendered;
  content?: WordPressRendered;
  yoast_head_json?: {
    title?: string;
    description?: string;
    og_image?: Array<{ url?: string; width?: number; height?: number; alt?: string }>;
  };
  _embedded?: {
    "wp:featuredmedia"?: WordPressMedia[];
  };
}
