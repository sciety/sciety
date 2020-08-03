import { RenderEndorsedArticles } from './render-endorsed-articles';
import { RenderPageHeader } from './render-page-header';
import { RenderReviews } from './render-reviews';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';

type RenderPage = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

export type FetchArticle = (doi: Doi) => Promise<{
  doi: Doi;
  title: string;
}>;

export default (
  renderPageHeader: RenderPageHeader,
  renderEndorsedArticles: RenderEndorsedArticles,
  renderReviewedArticles: RenderReviews,
): RenderPage => (
  async (editorialCommunityId) => `
    ${await renderPageHeader(editorialCommunityId)}
    <section class="ui statistics">
      ${await renderEndorsedArticles(editorialCommunityId)}
      ${await renderReviewedArticles(editorialCommunityId)}
    </section>
  `
);
