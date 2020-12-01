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

type Component = (userId: UserId, viewingUserId: Maybe<UserId>) => Promise<Result<string, 'not-found' | 'unavailable'>>;

const template = (header: string) => (followList: string) => (userDisplayName:string) => (
  {
    title: `${userDisplayName} | Sciety`,
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

type GetUserDisplayName = (userId: UserId) => Promise<string>;

export default (
  renderHeader: Component,
  renderFollowList: Component,
  getUserDisplayName: GetUserDisplayName,
): RenderPage => async (userId, viewingUserId) => {
  const header = renderHeader(userId, viewingUserId);
  const followList = renderFollowList(userId, viewingUserId);
  const userDisplayName = getUserDisplayName(userId);

  return Result.ok(template)
    .ap(await header)
    .ap(await followList)
    .ap(Result.ok(await userDisplayName))
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
