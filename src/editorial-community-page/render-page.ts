import { NotFound } from 'http-errors';
import createGetReviewedArticlesFromReviewReferences from './get-reviewed-articles-from-review-references';
import createRenderEndorsedArticles, {
  createGetHardCodedEndorsedArticles,
  GetArticleTitle,
} from './render-endorsed-articles';
import createRenderPageHeader, { GetEditorialCommunity } from './render-page-header';
import createRenderReviewedArticles from './render-reviewed-articles';
import Doi from '../types/doi';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import ReviewReferenceRepository from '../types/review-reference-repository';

type RenderPage = (editorialCommunityId: string) => Promise<string>;

export type FetchArticle = (doi: Doi) => Promise<{
  doi: Doi;
  title: string;
}>;

// these should be the set of adapters necessary for the ports of the render* components used in this page
export default (
  fetchArticle: FetchArticle,
  reviewReferenceRepository: ReviewReferenceRepository,
  editorialCommunities: EditorialCommunityRepository,
): RenderPage => {
  // these adapters should be moved up into index.ts
  const getEditorialCommunity: GetEditorialCommunity = async (editorialCommunityId) => {
    const editorialCommunity = editorialCommunities
      .lookup(editorialCommunityId)
      .unwrapOrElse(() => {
        throw new NotFound(`${editorialCommunityId} not found`);
      });
    return editorialCommunity;
  };
  const getArticleTitle: GetArticleTitle = async (articleDoi) => {
    const article = await fetchArticle(articleDoi);
    return article.title;
  };
  const getEndorsedArticles = createGetHardCodedEndorsedArticles(getArticleTitle);
  const getReviewedArticles = createGetReviewedArticlesFromReviewReferences(
    reviewReferenceRepository.findReviewsForEditorialCommunityId,
    fetchArticle,
  );
  const renderPageHeader = createRenderPageHeader(getEditorialCommunity);
  const renderEndorsedArticles = createRenderEndorsedArticles(getEndorsedArticles);
  const renderReviewedArticles = createRenderReviewedArticles(getReviewedArticles);

  // components should not be created inside the function below at request time,
  // but only at page component creation time
  return async (editorialCommunityId) => `
    ${await renderPageHeader(editorialCommunityId)}
    ${await renderEndorsedArticles(editorialCommunityId)}
    ${await renderReviewedArticles(editorialCommunityId)}
  `;
};
