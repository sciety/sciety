import { DomainEvent, isEvaluationRecordedEvent } from '../../domain-events';
import { Doi } from '../../types/doi';
import * as GroupId from '../../types/group-id';

export type MissingArticles = ReadonlyArray<Doi>;

export const handleEvent = (readmodel: MissingArticles, event: DomainEvent): MissingArticles => {
  if (isEvaluationRecordedEvent(event)) {
    if (event.groupId === GroupId.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0')) {
      return [
        event.articleId,
      ];
    }
  }
  return readmodel;
};
