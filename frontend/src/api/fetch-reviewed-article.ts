import article3 from '../data/article3';
import article4 from '../data/article4';
import { ReviewedArticle } from '../types/reviewed-article';
import { FetchReview } from './fetch-review';

export type FetchReviewedArticle = (doi: string) => ReviewedArticle;

export default (fetchReview: FetchReview): FetchReviewedArticle => (
  (doi: string): ReviewedArticle => {
    const allArticles = [
      article3,
      article4,
    ];

    const allReviewedArticles = {
      [article3.article.doi]: article3.reviews.map((review) => review.doi),
      [article4.article.doi]: article4.reviews.map((review) => review.doi),
    };

    if (!(doi in allReviewedArticles)) {
      throw new Error(`Article DOI ${doi} not found`);
    }

    const matches = allArticles.filter((reviewedArticle) => reviewedArticle.article.doi === doi);
    if (matches.length !== 1) {
      throw new Error(`Article DOI ${doi} not found`);
    }

    const reviewedArticle = matches[0];

    return {
      article: reviewedArticle.article,
      reviews: allReviewedArticles[doi].map(fetchReview),
    };
  }
);
