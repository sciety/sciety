import { sequenceS } from 'fp-ts/Apply';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../domain-events';
import { isUserSavedArticleEvent } from '../domain-events/user-saved-article-event';
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

};

type CreateUserSavedArticlesListAsGenericList = (ports: Ports) => (event: DomainEvent) => T.Task<undefined>;

// ts-unused-exports:disable-next-line
export const createUserSavedArticlesListAsGenericList: CreateUserSavedArticlesListAsGenericList = (
  ports,
) => (event) => pipe(
  event,
  TE.fromPredicate(isUserSavedArticleEvent, () => 'event not of interest'),
  TE.chain(({ userId }) => pipe(
    {
      ownerId: TE.right(LOID.fromUserId(userId)),
      name: pipe(
        userId,
        ports.getUserDetails,
        TE.map(({ handle }) => `@${handle}'s saved articles`),
      ),
    },
    sequenceS(TE.ApplyPar),
  )),
  TE.chain(ports.createList),
  TE.match(
    () => undefined,
    () => undefined,
  ),
);
