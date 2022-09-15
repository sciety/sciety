import { sequenceS } from 'fp-ts/Apply';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../domain-events';
import { isUserSavedArticleEvent } from '../domain-events/user-saved-article-event';
import { ListId } from '../types/list-id';
import { ListOwnerId } from '../types/list-owner-id';
import * as LOID from '../types/list-owner-id';
import { UserId } from '../types/user-id';

type CreateListCommand = {
  ownerId: LOID.ListOwnerId,
};

type UserDetails = {
  handle: string,
};

// ts-unused-exports:disable-next-line
export type Ports = {
  createList: (command: CreateListCommand) => TE.TaskEither<unknown, void>,
  getUserDetails: (userId: UserId) => TE.TaskEither<unknown, UserDetails>,
  getListsOwnedBy: (ownerId: LOID.ListOwnerId) => TE.TaskEither<unknown, ReadonlyArray<{ id: ListId }>>,
};

const constructCommand = (userDetails: { userId: UserId, handle: string }) => ({
  ownerId: LOID.fromUserId(userDetails.userId),
  name: `@${userDetails.handle}'s saved articles`,
  description: `Articles that have been saved by @${userDetails.handle}`,
});

type CreateUserSavedArticlesListAsGenericList = (ports: Ports) => (event: DomainEvent) => T.Task<undefined>;

// ts-unused-exports:disable-next-line
export const createUserSavedArticlesListAsGenericList: CreateUserSavedArticlesListAsGenericList = (
  ports,
) => (event) => pipe(
  event,
  TE.fromPredicate(isUserSavedArticleEvent, () => 'event not of interest'),
  TE.chain((userSavedArticleEvent) => pipe(
    userSavedArticleEvent.userId,
    LOID.fromUserId,
    ports.getListsOwnedBy,
    TE.filterOrElseW(RA.isEmpty, () => 'user already owns a list'),
    TE.map(() => userSavedArticleEvent),
  )),
  TE.chain((userSavedArticleEvent) => pipe(
    {
      userId: TE.right(userSavedArticleEvent.userId),
      handle: pipe(
        userSavedArticleEvent.userId,
        ports.getUserDetails,
        TE.map(({ handle }) => handle),
      ),
    },
    sequenceS(TE.ApplyPar),
  )),
  TE.map(constructCommand),
  TE.chain(ports.createList),
  TE.match(
    () => undefined,
    () => undefined,
  ),
);
