import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  DomainEvent,
  UserSavedArticleEvent,
  UserUnsavedArticleEvent,
} from '../domain-events';
import {
  AddArticleToList, Logger, RemoveArticleFromList, SelectAllListsOwnedBy,
} from '../shared-ports';
import { CommandResult } from '../types/command-result';
import * as LOID from '../types/list-owner-id';

// ts-unused-exports:disable-next-line
export type Ports = {
  addArticleToList: AddArticleToList,
  removeArticleFromList: RemoveArticleFromList,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
  logger: Logger,
};

type RelevantEvent = UserSavedArticleEvent | UserUnsavedArticleEvent;

const toCommand = (adapters: Ports) => (event: RelevantEvent) => pipe(
  event.userId,
  LOID.fromUserId,
  adapters.selectAllListsOwnedBy,
  RA.head,
  E.fromOption(() => 'user has no generic list' as const),
  E.map(({ listId }) => ({
    articleId: event.articleId,
    listId,
  })),
);

const processRelevantEvent = (adapters: Ports) => (candidateEvent: DomainEvent) => {
  switch (candidateEvent.type) {
    case 'UserUnsavedArticle': return pipe(
      candidateEvent,
      toCommand(adapters),
      TE.fromEither,
      TE.chainW(adapters.removeArticleFromList),
    );
    case 'UserSavedArticle': return pipe(
      candidateEvent,
      toCommand(adapters),
      TE.fromEither,
      TE.chainW(adapters.addArticleToList),
    );
    default: return TE.right('no-events-created' as CommandResult);
  }
};

type ReplicateUserSavedArticleListAsGenericList = (adapters: Ports) => (event: DomainEvent) => T.Task<undefined>;

// ts-unused-exports:disable-next-line
export const replicateUserSavedArticlesListAsGenericList: ReplicateUserSavedArticleListAsGenericList = (
  adapters,
) => (event) => pipe(
  event,
  processRelevantEvent(adapters),
  TE.match(
    (reason) => {
      adapters.logger('error', 'replicateUserSavedArticlesListAsGenericList policy failed', { reason, event });
      return undefined;
    },
    () => undefined,
  ),
);
