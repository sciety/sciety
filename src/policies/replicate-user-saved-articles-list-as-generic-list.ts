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
  AddArticleToList, GetListsOwnedBy, Logger, RemoveArticleFromList,
} from '../shared-ports';
import * as LOID from '../types/list-owner-id';

// ts-unused-exports:disable-next-line
export type Ports = {
  addArticleToList: AddArticleToList,
  removeArticleFromList: RemoveArticleFromList,
  getListsOwnedBy: GetListsOwnedBy,
  logger: Logger,
};

type RelevantEvent = UserSavedArticleEvent | UserUnsavedArticleEvent;

const toCommand = (adapters: Ports) => (event: RelevantEvent) => pipe(
  event.userId,
  LOID.fromUserId,
  adapters.getListsOwnedBy,
  TE.map(RA.head),
  TE.chainW(TE.fromOption(() => 'user has no generic list' as const)),
  TE.map((list) => ({
    articleId: event.articleId,
    listId: list.id,
  })),
);

const processRelevantEvent = (adapters: Ports) => (candidateEvent: DomainEvent) => {
  switch (candidateEvent.type) {
    case 'UserUnsavedArticle': return pipe(
      candidateEvent,
      toCommand(adapters),
      TE.chain(adapters.removeArticleFromList),
    );
    case 'UserSavedArticle': return pipe(
      candidateEvent,
      toCommand(adapters),
      TE.chain(adapters.addArticleToList),
    );
    default: return TE.right(undefined);
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
