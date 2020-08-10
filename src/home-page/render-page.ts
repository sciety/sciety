import FollowList from '../types/follow-list';

type RenderPage = (followList: FollowList) => Promise<string>;

type Component = (followList: FollowList) => Promise<string>;

export default (
  renderPageHeader: Component,
  renderEditorialCommunities: Component,
  renderFindArticle: Component,
  renderFeed: Component,
): RenderPage => async (followList) => `
      <div class="ui aligned stackable grid">
        <div class="row">
          <div class="column">
            ${await renderPageHeader(followList)}
          </div>
        </div>
        <div class="row">
          <section class="ten wide column">
            ${await renderFeed(followList)}
          </section>
          <section class="four wide right floated column">
            ${await renderFindArticle(followList)}
            ${await renderEditorialCommunities(followList)}
          </section>
        </div>
      </div>
    `;
