export interface HelpCenterArticle {
  id: string;
  category: string[];
  collectionId: string;
  collectionName: string;
  content: string;
  created: string;
  description: string;
  thumbnail: string;
  title: string;
  featured?: boolean;
  updated: string;
}
