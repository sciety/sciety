import { UserId } from '../types/user-id';

type RenderPage = (userId: UserId) => Promise<string>;

type Component = (userId: UserId) => Promise<string>;

export default (
  renderPageHeader: Component,
  renderEditorialCommunities: Component,
  renderFindArticle: Component,
  renderFeed: Component,
): RenderPage => async (userId) => `
      <div class="ui aligned stackable grid">
        <div class="row">
          <div class="column">
            ${await renderPageHeader(userId)}
          </div>
        </div>
        <div class="row">
          <section class="ten wide column">
            ${await renderFeed(userId)}
          </section>
          <section class="four wide right floated column">
            ${await renderFindArticle(userId)}
            ${await renderEditorialCommunities(userId)}
          </section>
        </div>
      </div>
    `;
