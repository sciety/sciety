import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { scietyFeedCard } from './sciety-feed-card';
import { UserSavedArticleEvent } from '../../domain-events';
import * as DE from '../../types/data-error';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';

export type GetUserDetails = (userId: UserId) => TE.TaskEither<DE.DataError, {
  handle: string,
  avatarUrl: string,
}>;

type UserSavedArticleToAListCard = (
  getUserDetails: GetUserDetails
) => (event: UserSavedArticleEvent) => TE.TaskEither<DE.DataError, HtmlFragment>;

export const userSavedArticleToAListCard: UserSavedArticleToAListCard = (getUserDetails) => (event) => pipe(
  event.userId,
  getUserDetails,
  TE.match(
    () => ({
      titleText: 'A user saved an article to a list',
      linkUrl: `/users/${event.userId}/lists`,
      avatarUrl: '/static/images/sciety-logo.jpg',
      date: event.date,
      details: {
        title: toHtmlFragment('Saved articles'),
        content: toHtmlFragment('<p>Articles that have been saved by this user, most recently saved first.</p>'),
      },
    }),
    ({ handle, avatarUrl }) => ({
      titleText: `${handle} saved an article to a list`,
      linkUrl: `/users/${handle}/lists/saved-articles`,
      avatarUrl,
      date: event.date,
      details: {
        title: toHtmlFragment('Saved articles'),
        content: toHtmlFragment(`<p>Articles that have been saved by @${handle}, most recently saved first.</p>`),
      },
    }),
  ),
  T.map(scietyFeedCard),
  T.map(E.right),
);
