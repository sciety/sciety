import { Maybe, Result } from 'true-myth';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

type Component = (editorialCommunityId: EditorialCommunityId, userId: Maybe<UserId>) => Promise<string>;

type RenderPageError = {
  type: 'not-found',
  content: string,
};

export type RenderPage = (
  editorialCommunityId: EditorialCommunityId,
  userId: Maybe<UserId>
) => Promise<Result<string, RenderPageError>>;

export default (
  renderPageHeader: Component,
  renderDescription: Component,
  renderFeed: Component,
  renderFollowers: Component,
): RenderPage => (
  async (editorialCommunityId, userId) => {
    try {
      return Result.ok(`
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
      `);
    } catch (error: unknown) {
      return Result.err({
        type: 'not-found',
        content: `Editorial community id '${editorialCommunityId.value}' not found`,
      });
    }
  }
);
