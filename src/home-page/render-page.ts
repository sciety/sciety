import { Maybe, Result } from 'true-myth';
import { UserId } from '../types/user-id';

export type RenderPage = (userId: Maybe<UserId>) => Promise<Result<{content: string}, never>>;

type Component = (userId: Maybe<UserId>) => Promise<string>;

export default (
  renderPageHeader: Component,
  renderEditorialCommunities: Component,
  renderSearchForm: Component,
  renderFeed: Component,
): RenderPage => async (userId) => Result.ok({
  content: `
    <div class="hive-grid hive-grid--home u-full-width">
      ${await renderPageHeader(userId)}

      <div class="home-page-feed-container">
        ${await renderFeed(userId)}
      </div>

      <div class="home-page-side-bar">
        ${await renderSearchForm(userId)}
        ${await renderEditorialCommunities(userId)}
      </div>

    </div>
  `,
});
