import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isEvaluationRecordedEvent } from '../../domain-events';
import { GroupId } from '../../types/group-id';

type GroupMeta = {
  evaluationCount: number,
  latestActivity: O.Option<Date>,
};

export const updateGroupMeta = (groupId: GroupId) => (meta: GroupMeta, event: DomainEvent): GroupMeta => {
  if (isEvaluationRecordedEvent(event) && event.groupId === groupId) {
    return pipe(
      meta.latestActivity,
      O.fold(
        () => ({
          ...meta,
          evaluationCount: meta.evaluationCount + 1,
          latestActivity: O.some(event.publishedAt),
        }),
        (date) => (event.publishedAt > date ? {
          ...meta,
          evaluationCount: meta.evaluationCount + 1,
          latestActivity: O.some(event.publishedAt),
        } : {
          ...meta,
          evaluationCount: meta.evaluationCount + 1,
        }),
      ),
    );
  }
  return meta;
};
