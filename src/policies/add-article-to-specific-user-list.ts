import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { DomainEvent } from '../domain-events';
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

export const addArticleToSpecificUserList: AddArticleToSpecificUserList = () => () => T.of(undefined);
