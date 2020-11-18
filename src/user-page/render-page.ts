import { Maybe, Result } from 'true-myth';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';
import { UserId } from '../types/user-id';

export type RenderPage = (
  userId: UserId,
  viewingUserId: Maybe<UserId>,
) => Promise<Result<{content: HtmlFragment}, RenderPageError>>;

type Component = (userId: UserId, viewingUserId: Maybe<UserId>) => Promise<Result<string, 'not-found' | 'unavailable'>>;

const template = (header: string) => (followList: string) => (
  {
    content: toHtmlFragment(`
      <div class="sciety-grid sciety-grid--user">
        ${header}
        <div class="user-page-contents">
          ${followList}
        </div>
      </div>
    `),
  }
);

export default (
  renderHeader: Component,
  renderFollowList: Component,
): RenderPage => async (userId, viewingUserId) => {
  const header = renderHeader(userId, viewingUserId);
  const followList = renderFollowList(userId, viewingUserId);

  return Result.ok(template)
    .ap(await header)
    .ap(await followList)
    .mapErr((e) => {
      if (e === 'not-found') {
        return {
          type: 'not-found',
          message: toHtmlFragment('User not found'),
        };
      }
      return {
        type: 'unavailable',
        message: toHtmlFragment('User information unavailable'),
      };
    });
};
