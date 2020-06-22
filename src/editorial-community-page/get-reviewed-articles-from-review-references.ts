import { GetReviewedArticles } from './render-reviewed-articles';
import Doi from '../data/doi';
import ReviewReference from '../types/review-reference';

export type FetchArticle = (doi: Doi) => Promise<{
  doi: Doi;
  title: string;
}>;

const uniqueDois = (dois: ReadonlyArray<Doi>): ReadonlyArray<Doi> => {
  const entries = dois.map((doi): [string, Doi] => ([doi.value, doi]));

  return Array.from(new Map(entries).values());
};

type FindReviewReferences = (editorialCommunityId: string) => ReadonlyArray<ReviewReference>;

export default (
  findReviewReferences: FindReviewReferences,
  fetchArticle: FetchArticle,
): GetReviewedArticles => (
  async (editorialCommunityId) => {
    const reviewedArticleVersionDois = findReviewReferences(editorialCommunityId)
      .map((reviewReference) => reviewReference.articleVersionDoi);

    return Promise.all(uniqueDois(reviewedArticleVersionDois).map(fetchArticle));
  }
);
