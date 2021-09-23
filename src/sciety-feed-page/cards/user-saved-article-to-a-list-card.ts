import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { UserSavedArticleEvent } from '../../domain-events';
import * as DE from '../../types/data-error';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';

type GetUserDetails = (userId: UserId) => TE.TaskEither<DE.DataError, { handle: string }>;

type UserSavedArticleToAListCard = (
  getUserDetails: GetUserDetails
) => (event: UserSavedArticleEvent) => TE.TaskEither<DE.DataError, HtmlFragment>;

// ts-unused-exports:disable-next-line
export const userSavedArticleToAListCard: UserSavedArticleToAListCard = (getUserDetails) => (event) => pipe(
  event.userId,
  getUserDetails,
  TE.map(({ handle }) => handle),
  TE.map(toHtmlFragment),
);
