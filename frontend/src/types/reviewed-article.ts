import { Review } from './review';

interface Article {
  title: string;
  category: string;
  type: string;
  doi: string;
  publicationDate: Date;
  abstract: string;
  authors: string[];
}

export interface ReviewedArticle {
  article: Article;
  reviews: Review[];
}
