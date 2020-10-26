import { Maybe } from 'true-myth';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

type Component = (editorialCommunityId: EditorialCommunityId, userId: Maybe<UserId>) => Promise<string>;

type RenderPage = (editorialCommunityId: EditorialCommunityId, userId: Maybe<UserId>) => Promise<string>;

export default (
  renderPageHeader: Component,
  renderDescription: Component,
  renderFeed: Component,
  renderFollowers: Component,
): RenderPage => (
  async (editorialCommunityId, userId) => (
    `
      <div class="hive-grid hive-grid--editorial-community u-full-width">
        ${await renderPageHeader(editorialCommunityId, userId)}

        <div class="editorial-community-page-description">
          ${await renderDescription(editorialCommunityId, userId)}
        </div>
        <div class="editorial-community-page-side-bar">
          ${await renderFollowers(editorialCommunityId, userId)}
          ${await renderFeed(editorialCommunityId, userId)}
        </div>
      </div>
    `
  )
);
