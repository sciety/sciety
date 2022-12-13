import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { addArticleToListCommandHandler, Ports as AddArticleToListPorts } from '../add-article-to-list';
import { DomainEvent, EvaluationRecordedEvent, isEvaluationRecordedEvent } from '../domain-events';
import { Logger } from '../shared-ports';

import { GroupId } from '../types/group-id';
import { ListId } from '../types/list-id';

type GetEvaluatedArticlesListIdForGroup = (groupId: GroupId) => O.Option<ListId>;

export type Ports = AddArticleToListPorts & {
  logger: Logger,
  getEvaluatedArticlesListIdForGroup: GetEvaluatedArticlesListIdForGroup,
};

// ts-unused-exports:disable-next-line
export const constructCommand = (
  ports: { logger: Logger, getEvaluatedArticlesListIdForGroup: GetEvaluatedArticlesListIdForGroup },
) => (event: EvaluationRecordedEvent) => pipe(
  event.groupId,
  ports.getEvaluatedArticlesListIdForGroup,
  E.fromOption(() => undefined),
  E.bimap(
    () => {
      ports.logger('error', 'Unknown group id supplied to policy', { event });
      return undefined;
    },
    (listId) => ({
      articleId: event.articleId,
      listId,
    }),
  ),
);

export const addArticleToEvaluatedArticlesList = (ports: Ports) => (event: DomainEvent): T.Task<void> => pipe(
  event,
  E.fromPredicate(isEvaluationRecordedEvent, () => undefined),
  E.chain(constructCommand(ports)),
  TE.fromEither,
  TE.chainW(addArticleToListCommandHandler(ports)),
  TE.match(
    (errorMessage) => {
      ports.logger('error', 'Failed to add article to list', { errorMessage, event });
    },
    () => { },
  ),
);
