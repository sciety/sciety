import { GetReviewedArticles } from './render-reviewed-articles';
import Doi from '../data/doi';
import ReviewReferenceRepository from '../types/review-reference-repository';

type FetchArticle = (doi: Doi) => Promise<{
  doi: Doi;
  title: string;
}>;

export default (
  reviewReferenceRepository: ReviewReferenceRepository,
  fetchArticle: FetchArticle,
): GetReviewedArticles => (
  async (editorialCommunityId) => {
    const reviewedArticleVersions = reviewReferenceRepository.findReviewsForEditorialCommunityId(editorialCommunityId)
      .map((reviewReference) => reviewReference.articleVersionDoi);

    return Promise.all(reviewedArticleVersions.map(fetchArticle));
  }
);
