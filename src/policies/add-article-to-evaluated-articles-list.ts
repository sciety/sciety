import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { addArticleToList, Ports as AddArticleToListPorts } from '../add-article-to-list';
import { DomainEvent, isEvaluationRecordedEvent } from '../domain-events';
import { Logger } from '../infrastructure/logger';
import * as Gid from '../types/group-id';

export type Ports = AddArticleToListPorts & {
  logger: Logger,
};

export const addArticleToEvaluatedArticlesList = (ports: Ports) => (event: DomainEvent): T.Task<void> => {
  if (!isEvaluationRecordedEvent(event)) {
    return T.of(undefined);
  }
  if (event.groupId !== Gid.fromValidatedString('8ccea9c2-e6c8-4dd7-bf1d-37c3fa86ff65')) {
    return T.of(undefined);
  }
  const command = {
    articleId: event.articleId.value,
    listId: 'e9606e0e-8fdb-4336-a24a-cc6547d7d950',
  };
  ports.logger('debug', 'Policy attempting to add article to list', { command });
  return pipe(
    command,
    addArticleToList(ports),
    TE.match(
      (errorMessage) => {
        ports.logger('error', 'Failed to add article to list', { errorMessage, command });
      },
      () => { },
    ),
  );
};
