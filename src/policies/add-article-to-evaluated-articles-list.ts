import { DomainEvent, isEvaluationRecordedEvent } from '../domain-events';
import { Logger } from '../infrastructure';

export const addArticleToEvaluatedArticlesList = (logger: Logger) => (event: DomainEvent): void => {
  if (isEvaluationRecordedEvent(event)) {
    logger('info', 'EvaluationRecorded event triggered AddArticleToEvaluatedArticlesList policy', { event });
  }
};
