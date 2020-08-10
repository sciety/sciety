import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';

type Component = (editorialCommunityId: EditorialCommunityId, followList: FollowList) => Promise<string>;

type RenderPage = (editorialCommunityId: EditorialCommunityId, followList: FollowList) => Promise<string>;

export default (
  renderPageHeader: Component,
  renderDescription: Component,
  renderEndorsedArticles: Component,
  renderReviewedArticles: Component,
  renderFeed: Component,
): RenderPage => (
  async (editorialCommunityId, followList) => (
    `
      <div class="ui aligned stackable grid">
        <div class="row">
          <div class="column">
            ${await renderPageHeader(editorialCommunityId, followList)}
          </div>
        </div>
        <div class="row">
          <div class="eight wide column">
            ${await renderDescription(editorialCommunityId, followList)}
          </div>
          <div class="eight wide column">
            <section class="ui two statistics">
              ${await renderEndorsedArticles(editorialCommunityId, followList)}
              ${await renderReviewedArticles(editorialCommunityId, followList)}
            </section>
            ${await renderFeed(editorialCommunityId, followList)}
          </div>
        </div> 
      </div>
    `
  )
);
