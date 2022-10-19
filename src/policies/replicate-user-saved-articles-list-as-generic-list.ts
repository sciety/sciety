import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  DomainEvent,
  isUserSavedArticleEvent,
  isUserUnsavedArticleEvent,
  UserSavedArticleEvent,
  UserUnsavedArticleEvent,
} from '../domain-events';
import { AddArticleToList, GetListsOwnedBy, Logger } from '../shared-ports';
import { Doi } from '../types/doi';
import { ListId } from '../types/list-id';
import * as LOID from '../types/list-owner-id';

type RemoveArticleFromList = (command: { listId: ListId, articleId: Doi }) => TE.TaskEither<string, void>;

// ts-unused-exports:disable-next-line
export type Ports = {
  addArticleToList: AddArticleToList,
  removeArticleFromList: RemoveArticleFromList,
  getListsOwnedBy: GetListsOwnedBy,
  logger: Logger,
};

type RelevantEvent = UserSavedArticleEvent | UserUnsavedArticleEvent;

const isRelevantEvent = (
  event: DomainEvent,
): event is RelevantEvent => isUserSavedArticleEvent(event) || isUserUnsavedArticleEvent(event);

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

type ReplicateUserSavedArticleListAsGenericList = (adapters: Ports) => (event: DomainEvent) => T.Task<undefined>;

// ts-unused-exports:disable-next-line
export const replicateUserSavedArticlesListAsGenericList: ReplicateUserSavedArticleListAsGenericList = (
  adapters,
) => (event) => pipe(
  event,
  TE.fromPredicate(isRelevantEvent, () => 'not interesting'),
  TE.chain((relevantEvent) => {
    switch (relevantEvent.type) {
      case 'UserUnsavedArticle': return pipe(
        relevantEvent,
        toCommand(adapters),
        TE.chain(adapters.removeArticleFromList),
      );
      case 'UserSavedArticle': return pipe(
        relevantEvent,
        toCommand(adapters),
        TE.chain(adapters.addArticleToList),
      );
    }
  }),
  TE.match(
    (reason) => {
      adapters.logger('error', 'replicateUserSavedArticlesListAsGenericList policy failed', { reason, event });
      return undefined;
    },
    () => undefined,
  ),
);
