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
      <div class="ui aligned stackable grid">
        <div class="row">
          <div class="column">
            ${await renderPageHeader(editorialCommunityId)}
          </div>
        </div>
        <div class="row">
          <div class="eight wide column">
            ${await renderDescription(editorialCommunityId)}
          </div>
          <div class="eight wide column">
            <section class="ui two statistics">
              ${await renderEndorsedArticles(editorialCommunityId)}
              ${await renderReviewedArticles(editorialCommunityId)}
            </section>
            ${await renderFeed(editorialCommunityId)}
          </div>
        </div> 
      </div>
    `
  )
);
