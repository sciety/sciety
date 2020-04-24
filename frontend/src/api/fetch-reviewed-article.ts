import article3 from '../data/article3';
import article4 from '../data/article4';
import ReviewReferenceRepository from '../types/review-reference-repository';
import { ReviewedArticle } from '../types/reviewed-article';
import { FetchReview } from './fetch-review';

export type FetchReviewedArticle = (doi: string) => Promise<ReviewedArticle>;

export default (reviewReferenceRepository: ReviewReferenceRepository, fetchReview: FetchReview):
FetchReviewedArticle => (
  async (doi: string): Promise<ReviewedArticle> => {
    const allArticles = [
      article3,
      article4,
    ];


    const allReviewedArticles = {
      [article3.article.doi]: reviewReferenceRepository.findReviewDoisForArticleDoi(article3.article.doi),
      [article4.article.doi]: reviewReferenceRepository.findReviewDoisForArticleDoi(article4.article.doi),
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
      reviews: await Promise.all(allReviewedArticles[doi].map(fetchReview)),
    };
  }
);
