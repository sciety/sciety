import { DomainEvent, isEvaluationRecordedEvent } from '../../domain-events';
import { Doi } from '../../types/doi';

export type MissingArticles = { articleIds: ReadonlyArray<Doi> };

export const handleEvent = (readmodel: MissingArticles, event: DomainEvent): MissingArticles => {
  if (isEvaluationRecordedEvent(event)) {
    return {
      articleIds: [
        event.articleId,
      ],
    };
  }
  return readmodel;
};
