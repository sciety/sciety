import * as O from 'fp-ts/lib/Option';
import { isHttpError } from 'http-errors';
import { NOT_FOUND } from 'http-status-codes';
import { Result } from 'true-myth';
import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';
import { UserId } from '../types/user-id';

type Component = (editorialCommunityId: EditorialCommunityId, userId: O.Option<UserId>) => Promise<string>;

type GetCommunityName = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

export type RenderPage = (
  editorialCommunityId: EditorialCommunityId,
  userId: O.Option<UserId>
) => Promise<Result<{
  title: string,
  content: HtmlFragment
}, RenderPageError>>;

export default (
  renderPageHeader: Component,
  renderDescription: Component,
  renderFeed: Component,
  renderFollowers: Component,
  getCommunityName: GetCommunityName,
): RenderPage => (
  async (editorialCommunityId, userId) => {
    try {
      return Result.ok({
        title: `${await getCommunityName(editorialCommunityId)}`,
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
      if (isHttpError(error) && error.status === NOT_FOUND) {
        return Result.err({
          type: 'not-found',
          message: toHtmlFragment(`Editorial community id '${editorialCommunityId.value}' not found`),
        });
      }

      return Result.err({
        type: 'unavailable',
        message: toHtmlFragment(`Editorial community id '${editorialCommunityId.value}' unavailable`),
      });
    }
  }
);
