import { Maybe } from 'true-myth';
import { UserId } from '../types/user-id';

type RenderPage = (userId: Maybe<UserId>) => Promise<string>;

type Component = (userId: Maybe<UserId>) => Promise<string>;

export default (
  renderPageHeader: Component,
  renderEditorialCommunities: Component,
  renderFindArticle: Component,
  renderFeed: Component,
): RenderPage => async (userId) => `
      <div class="hive-grid hive-grid--home u-full-width">
        ${await renderPageHeader(userId)}

        <section class="home-page-feed-container">
          ${await renderFeed(userId)}
        </section>

        <section class="home-page-side-bar">
          ${await renderFindArticle(userId)}
          ${await renderEditorialCommunities(userId)}
        </section>

      </div>
    `;
