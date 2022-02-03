import { DomainEvent, isEvaluationRecordedEvent } from '../domain-events';
import { Logger } from '../infrastructure/logger';
import * as Gid from '../types/group-id';

export const addArticleToEvaluatedArticlesList = (logger: Logger) => (event: DomainEvent): void => {
  if (isEvaluationRecordedEvent(event)) {
    if (event.groupId === Gid.fromValidatedString('8ccea9c2-e6c8-4dd7-bf1d-37c3fa86ff65')) {
      const command = { articleId: event.articleId.value, listId: 'e9606e0e-8fdb-4336-a24a-cc6547d7d950' };
      logger('info', 'EvaluationRecorded event triggered AddArticleToEvaluatedArticlesList policy', { command });
    }
  }
};
