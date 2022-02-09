import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { evaluatedArticlesListIdsByGroupId } from './add-article-to-evaluated-articles-list';
import { addArticleToList, Ports as AddArticleToListPorts } from '../add-article-to-list';
import { DomainEvent, isEvaluationRecordedEvent } from '../domain-events';
import { Logger } from '../infrastructure/logger';

type Ports = AddArticleToListPorts & {
  logger: Logger,
};

const calculateDateThatFollows = (originalDate: Date) => {
  const calculated = new Date(originalDate);
  calculated.setSeconds(originalDate.getSeconds() + 1);
  return calculated;
};

// ts-unused-exports:disable-next-line
export const addArticleToEvaluatedArticlesListWithEvaluationDate = (
  ports: Ports,
) => (event: DomainEvent): T.Task<void> => {
  if (!isEvaluationRecordedEvent(event)) {
    return T.of(undefined);
  }
  const listId = evaluatedArticlesListIdsByGroupId[event.groupId];
  if (!listId) {
    ports.logger('error', 'Unknown group id supplied to policy', { event });
    return T.of(undefined);
  }
  const command = {
    articleId: event.articleId.value,
    listId,
  };
  const followingDate = calculateDateThatFollows(event.date);
  ports.logger('debug', 'Policy attempting to add article to list', { command, followingDate });
  return pipe(
    addArticleToList(ports)(command, followingDate),
    TE.match(
      (errorMessage) => {
        ports.logger('error', 'Failed to add article to list', { errorMessage, command });
      },
      () => { },
    ),
  );
};
