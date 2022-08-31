import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { DomainEvent } from '../domain-events';
import { isUserSavedArticleEvent } from '../domain-events/user-saved-article-event';
import { Logger } from '../shared-ports';
import { Doi } from '../types/doi';
import * as LID from '../types/list-id';
import * as UID from '../types/user-id';

type AddArticleToListCommandPayload = {
  articleId: Doi, listId: LID.ListId,
};

type AddArticleToList = (payload: AddArticleToListCommandPayload) => TE.TaskEither<string, void>;

export type Ports = {
  addArticleToList: AddArticleToList,
  logger: Logger,
};

const logAnyErrorInAddArticleToList = (logger: Logger, event: DomainEvent) => (error: string) => {
  logger('error', 'Unsuccessful call to addArticleToList in addArticleToSpecificUserList', { error, event });
  return error;
};

export const specificUserListId = LID.fromValidatedString('list-id-931653361');

type AddArticleToSpecificUserList = (ports: Ports) => (event: DomainEvent) => T.Task<void>;

export const addArticleToSpecificUserList: AddArticleToSpecificUserList = (ports) => (event) => pipe(
  event,
  E.fromPredicate(isUserSavedArticleEvent, () => 'event not of interest'),
  E.filterOrElse(
    (userSavedEvent) => UID.eqUserId.equals(userSavedEvent.userId, UID.fromValidatedString('931653361')),
    () => 'not the right user',
  ),
  E.map((userSavedEvent) => ({
    articleId: userSavedEvent.articleId,
    listId: specificUserListId,
  })),
  TE.fromEither,
  TE.chain(flow(
    ports.addArticleToList,
    TE.mapLeft(logAnyErrorInAddArticleToList(ports.logger, event)),
  )),
  TE.match(
    () => undefined,
    () => undefined,
  ),
);
