import { RenderEndorsedArticles } from './render-endorsed-articles';
import { RenderPageHeader } from './render-page-header';
import { RenderReviewedArticles } from './render-reviewed-articles';
import Doi from '../types/doi';

type RenderPage = (editorialCommunityId: string) => Promise<string>;

export type FetchArticle = (doi: Doi) => Promise<{
  doi: Doi;
  title: string;
}>;

export default (
  renderPageHeader: RenderPageHeader,
  renderEndorsedArticles: RenderEndorsedArticles,
  renderReviewedArticles: RenderReviewedArticles,
): RenderPage => (
  async (editorialCommunityId) => `
    ${await renderPageHeader(editorialCommunityId)}
    ${await renderEndorsedArticles(editorialCommunityId)}
    ${await renderReviewedArticles(editorialCommunityId)}
  `
);
