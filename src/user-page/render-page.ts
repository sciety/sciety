import * as T from 'fp-ts/lib/Task';
import { Maybe, Result } from 'true-myth';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';
import { UserId } from '../types/user-id';

export type RenderPage = (
  userId: UserId,
  viewingUserId: Maybe<UserId>,
) => Promise<Result<{
  title: string,
  content: HtmlFragment
}, RenderPageError>>;

type Component = (userId: UserId, viewingUserId: Maybe<UserId>) => Promise<Result<HtmlFragment, 'not-found' | 'unavailable'>>;

const template = (header: HtmlFragment) => (followList: HtmlFragment) => (userDisplayName:string) => (
  {
    title: `${userDisplayName}`,
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

type RenderFollowList = (userId: UserId, viewingUserId: Maybe<UserId>) => T.Task<Result<HtmlFragment, never>>;
type GetUserDisplayName = (userId: UserId) => Promise<Result<string, 'not-found' | 'unavailable'>>;

export default (
  renderHeader: Component,
  renderFollowList: RenderFollowList,
  getUserDisplayName: GetUserDisplayName,
): RenderPage => async (userId, viewingUserId) => {
  const header = renderHeader(userId, viewingUserId);
  const followList = renderFollowList(userId, viewingUserId);
  const userDisplayName = getUserDisplayName(userId);

  return Result.ok(template)
    .ap(await header)
    .ap(await followList())
    .ap(await userDisplayName)
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
