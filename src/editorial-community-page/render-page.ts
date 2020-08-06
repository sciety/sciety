import { RenderDescription } from './render-description';
import { RenderEndorsedArticles } from './render-endorsed-articles';
import { RenderFeed } from './render-feed';
import { RenderPageHeader } from './render-page-header';
import { RenderReviews } from './render-reviews';
import EditorialCommunityId from '../types/editorial-community-id';

type RenderPage = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

export default (
  renderPageHeader: RenderPageHeader,
  renderDescription: RenderDescription,
  renderEndorsedArticles: RenderEndorsedArticles,
  renderReviewedArticles: RenderReviews,
  renderFeed: RenderFeed,
): RenderPage => (
  async (editorialCommunityId) => (
    `
      ${await renderPageHeader(editorialCommunityId)}
      ${await renderDescription(editorialCommunityId)}
      <section class="ui statistics">
        ${await renderEndorsedArticles(editorialCommunityId)}
        ${await renderReviewedArticles(editorialCommunityId)}
      </section>
      ${await renderFeed(editorialCommunityId)}
    `
  )
);
