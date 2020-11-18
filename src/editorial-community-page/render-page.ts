import { Maybe, Result } from 'true-myth';
import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';
import { UserId } from '../types/user-id';

type Component = (editorialCommunityId: EditorialCommunityId, userId: Maybe<UserId>) => Promise<string>;

export type RenderPage = (
  editorialCommunityId: EditorialCommunityId,
  userId: Maybe<UserId>
) => Promise<Result<{content: HtmlFragment}, RenderPageError>>;

export default (
  renderPageHeader: Component,
  renderDescription: Component,
  renderFeed: Component,
  renderFollowers: Component,
): RenderPage => (
  async (editorialCommunityId, userId) => {
    try {
      return Result.ok({
        content: toHtmlFragment(`
          <div class="sciety-grid sciety-grid--editorial-community">
            ${await renderPageHeader(editorialCommunityId, userId)}

            <div class="editorial-community-page-description">
              ${await renderDescription(editorialCommunityId, userId)}
            </div>
            <div class="editorial-community-page-side-bar">
              ${await renderFollowers(editorialCommunityId, userId)}
              ${await renderFeed(editorialCommunityId, userId)}
            </div>
          </div>
        `),
      });
    // TODO: push Results further down
    } catch (error: unknown) {
      return Result.err({
        type: 'not-found',
        message: toHtmlFragment(`Editorial community id '${editorialCommunityId.value}' not found`),
      });
    }
  }
);
