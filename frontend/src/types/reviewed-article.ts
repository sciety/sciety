import { Article } from './article';
import { Review } from './review';

export interface ReviewedArticle {
  article: Article;
  reviews: Review[];
}
