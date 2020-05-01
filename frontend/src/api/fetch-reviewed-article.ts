import { FetchArticle } from './fetch-article';
import { FetchReview } from './fetch-review';
import Doi from '../data/doi';
import ReviewReferenceRepository from '../types/review-reference-repository';
import { ReviewedArticle } from '../types/reviewed-article';

export type FetchReviewedArticle = (doi: Doi) => Promise<ReviewedArticle>;

export default (
  reviewReferenceRepository: ReviewReferenceRepository,
  fetchArticle: FetchArticle,
  fetchReview: FetchReview,
):
FetchReviewedArticle => (
  async (doi: Doi): Promise<ReviewedArticle> => {
    const articleReviews = reviewReferenceRepository.findReviewDoisForArticleDoi(doi);

    if (articleReviews.length === 0) {
      throw new Error(`Article DOI ${doi} not found`);
    }

    return {
      article: await fetchArticle(doi),
      reviews: await Promise.all(articleReviews.map(fetchReview)),
    };
  }
);
