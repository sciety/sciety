import { NotFound } from 'http-errors';
import createGetReviewedArticlesFromReviewReferences from './get-reviewed-articles-from-review-references';
import { RenderEndorsedArticles } from './render-endorsed-articles';
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

export default (
  fetchArticle: FetchArticle,
  reviewReferenceRepository: ReviewReferenceRepository,
  editorialCommunities: EditorialCommunityRepository,
  renderEndorsedArticles: RenderEndorsedArticles,
): RenderPage => {
  const getEditorialCommunity: GetEditorialCommunity = async (editorialCommunityId) => {
    const editorialCommunity = editorialCommunities
      .lookup(editorialCommunityId)
      .unwrapOrElse(() => {
        throw new NotFound(`${editorialCommunityId} not found`);
      });
    return editorialCommunity;
  };
  const getReviewedArticles = createGetReviewedArticlesFromReviewReferences(
    reviewReferenceRepository.findReviewsForEditorialCommunityId,
    fetchArticle,
  );
  const renderPageHeader = createRenderPageHeader(getEditorialCommunity);
  const renderReviewedArticles = createRenderReviewedArticles(getReviewedArticles);

  return async (editorialCommunityId) => `
    ${await renderPageHeader(editorialCommunityId)}
    ${await renderEndorsedArticles(editorialCommunityId)}
    ${await renderReviewedArticles(editorialCommunityId)}
  `;
};
