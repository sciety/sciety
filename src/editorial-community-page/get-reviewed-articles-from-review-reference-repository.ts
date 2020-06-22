import { GetReviewedArticles } from './render-reviewed-articles';
import Doi from '../data/doi';
import ReviewReferenceRepository from '../types/review-reference-repository';

export type FetchArticle = (doi: Doi) => Promise<{
  doi: Doi;
  title: string;
}>;

const uniqueDois = (dois: ReadonlyArray<Doi>): ReadonlyArray<Doi> => {
  const entries = dois.map((doi): [string, Doi] => ([doi.value, doi]));

  return Array.from(new Map(entries).values());
};

export default (
  reviewReferenceRepository: ReviewReferenceRepository,
  fetchArticle: FetchArticle,
): GetReviewedArticles => (
  async (editorialCommunityId) => {
    const reviewedArticleVersionDois = reviewReferenceRepository
      .findReviewsForEditorialCommunityId(editorialCommunityId)
      .map((reviewReference) => reviewReference.articleVersionDoi);

    return Promise.all(uniqueDois(reviewedArticleVersionDois).map(fetchArticle));
  }
);
