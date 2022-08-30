import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../domain-events';
import { isUserSavedArticleEvent } from '../domain-events/user-saved-article-event';
import { Doi } from '../types/doi';
import * as Lid from '../types/list-id';

type AddArticleToListCommandPayload = {
  articleId: Doi, listId: Lid.ListId,
};

type CallAddArticleToList = (payload: AddArticleToListCommandPayload) => TE.TaskEither<string, void>;

export type Ports = {
  callAddArticleToList: CallAddArticleToList,
};

type AddArticleToSpecificUserList = (ports: Ports) => (event: DomainEvent) => T.Task<void>;

export const addArticleToSpecificUserList: AddArticleToSpecificUserList = (ports) => (event) => pipe(
  event,
  E.fromPredicate(isUserSavedArticleEvent, () => 'event not of interest'),
  E.map((userSavedEvent) => ({
    articleId: userSavedEvent.articleId,
    listId: Lid.fromValidatedString('foo'),
  })),
  TE.fromEither,
  TE.chain(ports.callAddArticleToList),
  TE.match(
    () => undefined,
    () => undefined,
  ),
);
