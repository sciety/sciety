import { GetReviewedArticles } from './render-reviewed-articles';
import Doi from '../data/doi';
import ReviewReferenceRepository from '../types/review-reference-repository';

export type FetchArticle = (doi: Doi) => Promise<{
  doi: Doi;
  title: string;
}>;

export default (
  reviewReferenceRepository: ReviewReferenceRepository,
  fetchArticle: FetchArticle,
): GetReviewedArticles => (
  async (editorialCommunityId) => {
    const reviewedArticleVersionDois = reviewReferenceRepository
      .findReviewsForEditorialCommunityId(editorialCommunityId)
      .map((reviewReference) => reviewReference.articleVersionDoi.value);
    const uniqueReviewedArticleVersionDois = [...new Set(reviewedArticleVersionDois)].map((value) => new Doi(value));

    return Promise.all(uniqueReviewedArticleVersionDois.map(fetchArticle));
  }
);
