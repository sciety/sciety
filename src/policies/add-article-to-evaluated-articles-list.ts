import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { addArticleToListCommandHandler, Ports as AddArticleToListPorts } from '../write-side/add-article-to-list';
import { DomainEvent, EventOfType, isEventOfType } from '../domain-events';
import { Logger } from '../shared-ports';

import { GroupId } from '../types/group-id';
import { ListId } from '../types/list-id';
import { ErrorMessage, toErrorMessage } from '../types/error-message';
import { AddArticleToListCommand } from '../write-side/commands';

type GetEvaluatedArticlesListIdForGroup = (groupId: GroupId) => O.Option<ListId>;

export type Ports = AddArticleToListPorts & {
  logger: Logger,
  getEvaluatedArticlesListIdForGroup: GetEvaluatedArticlesListIdForGroup,
};

export const constructCommand = (
  ports: { logger: Logger, getEvaluatedArticlesListIdForGroup: GetEvaluatedArticlesListIdForGroup },
) => (event: EventOfType<'EvaluationRecorded'>): E.Either<ErrorMessage, AddArticleToListCommand> => pipe(
  event.groupId,
  ports.getEvaluatedArticlesListIdForGroup,
  E.fromOption(() => undefined),
  E.bimap(
    () => {
      ports.logger('error', 'Unknown group id supplied to policy', { event });
      return toErrorMessage('unknown-group-id');
    },
    (listId) => ({
      articleId: event.articleId,
      listId,
    }),
  ),
);

export const addArticleToEvaluatedArticlesList = (ports: Ports) => (event: DomainEvent): T.Task<void> => pipe(
  event,
  E.fromPredicate(isEventOfType('EvaluationRecorded'), () => 'not-interesting-event' as const),
  E.chainW(constructCommand(ports)),
  TE.fromEither,
  TE.chainW(flow(
    addArticleToListCommandHandler(ports),
    TE.mapLeft(() => 'command-execution-failed' as const),
  )),
  TE.match(
    (errorMessage) => {
      if (errorMessage === 'not-interesting-event') {
        return;
      }
      ports.logger('error', 'addArticleToEvaluatedArticlesList failed', { errorMessage, event });
    },
    () => { },
  ),
);
