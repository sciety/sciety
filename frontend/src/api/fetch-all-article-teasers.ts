import article3 from '../data/article3';
import article4 from '../data/article4';
import { ArticleTeaser } from '../types/article-teaser';

export default async (): Promise<Array<ArticleTeaser>> => [
  article3,
  article4,
].map(({ article, reviews }) => (
  {
    category: article.category,
    title: article.title,
    authors: article.authors,
    numberOfReviews: reviews.length,
    link: `/articles/${encodeURIComponent(article.doi)}`,
  }
));
