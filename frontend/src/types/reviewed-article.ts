import { Review } from './review';

export interface ReviewedArticle {
  title: string;
  category: string;
  type: string;
  doi: string;
  publicationDate: Date;
  abstract: string;
  authors: string[];
  reviews: Review[];
}
