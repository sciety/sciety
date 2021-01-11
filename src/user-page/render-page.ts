import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { Result } from 'true-myth';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';
import { UserId } from '../types/user-id';

export type RenderPage = (userId: UserId, viewingUserId: O.Option<UserId>) => T.Task<Result<{
  title: string,
  content: HtmlFragment
}, RenderPageError>>;

type Component = (userId: UserId, viewingUserId: O.Option<UserId>) => TE.TaskEither<'not-found' | 'unavailable', HtmlFragment>;

const template = (header: HtmlFragment) => (followList: HtmlFragment) => (userDisplayName:string) => {
  let savedArticlesList = '';
  if (userDisplayName === 'Sciety') {
    savedArticlesList = `
      <section>
        <h2>Saved articles</h2>
        <ol class="saved-articles">
          <li class="saved-articles__item">
            <a href="/articles/10.1101/2020.07.04.187583" class="saved-articles__link">Gender, race and parenthood impact academic productivity during the COVID-19 pandemic: from survey to action</a>
          </li>
          <li class="saved-articles__item">
            <a href="/articles/10.1101/2020.09.09.289785" class="saved-articles__link">The Costs and Benefits of a Modified Biomedical Science Workforce</a>
          </li>
        </ol>
      </section>
    `;
  }
  return {
    title: `${userDisplayName}`,
    content: toHtmlFragment(`
      <div class="sciety-grid sciety-grid--user">
        ${header}
        <div class="user-page-contents">
          ${followList}
          ${savedArticlesList}
        </div>
      </div>
    `),
  };
};

type RenderFollowList = (userId: UserId, viewingUserId: O.Option<UserId>) => TE.TaskEither<'not-found' | 'unavailable', HtmlFragment>;
type GetUserDisplayName = (userId: UserId) => TE.TaskEither<'not-found' | 'unavailable', string>;

export default (
  renderHeader: Component,
  renderFollowList: RenderFollowList,
  getUserDisplayName: GetUserDisplayName,
): RenderPage => (userId, viewingUserId) => async () => {
  const header = pipe(
    renderHeader(userId, viewingUserId),
    TE.fold(
      (error) => T.of(Result.err<HtmlFragment, 'not-found' | 'unavailable'>(error)),
      (html) => T.of(Result.ok<HtmlFragment, 'not-found' | 'unavailable'>(html)),
    ),
  )();
  const followList = pipe(
    renderFollowList(userId, viewingUserId),
    TE.fold(
      (error) => T.of(Result.err<HtmlFragment, 'not-found' | 'unavailable'>(error)),
      (html) => T.of(Result.ok<HtmlFragment, 'not-found' | 'unavailable'>(html)),
    ),
  );
  const userDisplayName = pipe(
    userId,
    getUserDisplayName,
    TE.map(toHtmlFragment),
    TE.fold(
      (error) => T.of(Result.err<HtmlFragment, 'not-found' | 'unavailable'>(error)),
      (html) => T.of(Result.ok<HtmlFragment, 'not-found' | 'unavailable'>(html)),
    ),
  )();

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
