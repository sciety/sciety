import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
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
) => T.Task<Result<{
  title: string,
  content: HtmlFragment
}, RenderPageError>>;

type RenderPageHeader = (editorialCommunityId: EditorialCommunityId) => T.Task<HtmlFragment>;

type RenderDescription = (editorialCommunityId: EditorialCommunityId) => T.Task<HtmlFragment>;

export default (
  renderPageHeader: RenderPageHeader,
  renderDescription: RenderDescription,
  renderFeed: Component,
  renderFollowers: (editorialCommunityId: EditorialCommunityId) => T.Task<HtmlFragment>,
  getCommunityName: GetCommunityName,
): RenderPage => (
  (editorialCommunityId, userId) => async () => {
    try {
      return Result.ok({
        title: `${await getCommunityName(editorialCommunityId)}`,
        content: toHtmlFragment(`
          <div class="sciety-grid sciety-grid--editorial-community">
            ${await renderPageHeader(editorialCommunityId)()}

            <div class="editorial-community-page-description">
            ${await renderDescription(editorialCommunityId)()}
            </div>
            <div class="editorial-community-page-side-bar">
              ${await renderFollowers(editorialCommunityId)()}
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
