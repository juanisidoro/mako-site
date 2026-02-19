export interface BlogSEO {
  schema: 'BlogPosting' | 'TechArticle' | 'Article';
  og_type: string;
  twitter_card: string;
}

export interface BlogConfig {
  slugs: Record<string, string>;
  date: string;
  updated?: string;
  author: string;
  tags: string[];
  cover?: string;
  draft: boolean;
  seo: BlogSEO;
}

export interface BlogMeta {
  /** Folder name (canonical identifier) */
  folder: string;
  /** Resolved slug for the requested locale */
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: string;
  tags: string[];
  cover?: string;
  readingTime: number;
  locale: string;
  seo: BlogSEO;
  /** Map of locale → slug for hreflang */
  slugsByLocale: Record<string, string>;
}

export interface BlogPost extends BlogMeta {
  content: string;
}
