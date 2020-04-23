import article3 from '../data/article3';
import article4 from '../data/article4';
import { ReviewedArticle } from '../types/reviewed-article';

export type FetchReviewedArticle = (doi: string) => ReviewedArticle;

export default (): FetchReviewedArticle => (
  (doi: string): ReviewedArticle => {
    const allArticles = [
      article3,
      article4,
    ];
    const matches = allArticles.filter((reviewedArticle) => reviewedArticle.article.doi === doi);
    if (matches.length !== 1) {
      throw new Error(`Article DOI ${doi} not found`);
    }
    return matches[0];
  }
);
