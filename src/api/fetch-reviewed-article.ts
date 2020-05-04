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
    const [article, reviews] = await Promise.all([
      fetchArticle(doi),
      Promise.all(reviewReferenceRepository.findReviewDoisForArticleDoi(doi).map(fetchReview)),
    ]);

    return {
      article,
      reviews,
    };
  }
);
