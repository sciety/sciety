import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { Result } from 'true-myth';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';
import { UserId } from '../types/user-id';

export type RenderPage = (
  userId: UserId,
  viewingUserId: O.Option<UserId>,
) => Promise<Result<{
  title: string,
  content: HtmlFragment
}, RenderPageError>>;

type Component = (userId: UserId, viewingUserId: O.Option<UserId>) => TE.TaskEither<'not-found' | 'unavailable', HtmlFragment>;

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

type RenderFollowList = (userId: UserId, viewingUserId: O.Option<UserId>) => T.Task<Result<HtmlFragment, never>>;
type GetUserDisplayName = (userId: UserId) => Promise<Result<string, 'not-found' | 'unavailable'>>;

export default (
  renderHeader: Component,
  renderFollowList: RenderFollowList,
  getUserDisplayName: GetUserDisplayName,
): RenderPage => async (userId, viewingUserId) => {
  const header = pipe(
    renderHeader(userId, viewingUserId),
    TE.fold(
      (error) => T.of(Result.err<HtmlFragment, 'not-found' | 'unavailable'>(error)),
      (html) => T.of(Result.ok<HtmlFragment, 'not-found' | 'unavailable'>(html)),
    ),
  )();
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
