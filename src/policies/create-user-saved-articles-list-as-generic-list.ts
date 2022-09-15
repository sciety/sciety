import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../domain-events';
import { isUserSavedArticleEvent } from '../domain-events/user-saved-article-event';
import * as LOID from '../types/list-owner-id';

type CreateListCommand = {
  ownerId: LOID.ListOwnerId,
};

// ts-unused-exports:disable-next-line
export type Ports = {
  createList: (command: CreateListCommand) => TE.TaskEither<unknown, void>,
};

type CreateUserSavedArticlesListAsGenericList = (ports: Ports) => (event: DomainEvent) => T.Task<undefined>;

// ts-unused-exports:disable-next-line
export const createUserSavedArticlesListAsGenericList: CreateUserSavedArticlesListAsGenericList = (
  ports,
) => (event) => pipe(
  event,
  TE.fromPredicate(isUserSavedArticleEvent, () => 'event not of interest'),
  TE.map(({ userId }) => ({ ownerId: LOID.fromUserId(userId) })),
  TE.chain(ports.createList),
  TE.match(
    () => undefined,
    () => undefined,
  ),
);
