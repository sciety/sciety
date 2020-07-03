import { NotFound } from 'http-errors';
import { RenderEndorsedArticles } from './render-endorsed-articles';
import createRenderPageHeader, { GetEditorialCommunity } from './render-page-header';
import { RenderReviewedArticles } from './render-reviewed-articles';
import Doi from '../types/doi';
import EditorialCommunityRepository from '../types/editorial-community-repository';

type RenderPage = (editorialCommunityId: string) => Promise<string>;

export type FetchArticle = (doi: Doi) => Promise<{
  doi: Doi;
  title: string;
}>;

export default (
  editorialCommunities: EditorialCommunityRepository,
  renderEndorsedArticles: RenderEndorsedArticles,
  renderReviewedArticles: RenderReviewedArticles,
): RenderPage => {
  const getEditorialCommunity: GetEditorialCommunity = async (editorialCommunityId) => {
    const editorialCommunity = editorialCommunities
      .lookup(editorialCommunityId)
      .unwrapOrElse(() => {
        throw new NotFound(`${editorialCommunityId} not found`);
      });
    return editorialCommunity;
  };
  const renderPageHeader = createRenderPageHeader(getEditorialCommunity);

  return async (editorialCommunityId) => `
    ${await renderPageHeader(editorialCommunityId)}
    ${await renderEndorsedArticles(editorialCommunityId)}
    ${await renderReviewedArticles(editorialCommunityId)}
  `;
};
