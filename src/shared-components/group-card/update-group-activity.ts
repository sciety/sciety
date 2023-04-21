import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isEvaluationRecordedEvent } from '../../domain-events';
import { GroupId } from '../../types/group-id';

type GroupActivity = {
  evaluationCount: number,
  latestActivityAt: O.Option<Date>,
};

export const updateGroupActivity = (
  groupId: GroupId,
) => (
  activity: GroupActivity,
  event: DomainEvent,
): GroupActivity => {
  if (isEvaluationRecordedEvent(event) && event.groupId === groupId) {
    return pipe(
      activity.latestActivityAt,
      O.fold(
        () => ({
          ...activity,
          evaluationCount: activity.evaluationCount + 1,
          latestActivityAt: O.some(event.publishedAt),
        }),
        (date) => (event.publishedAt > date ? {
          ...activity,
          evaluationCount: activity.evaluationCount + 1,
          latestActivityAt: O.some(event.publishedAt),
        } : {
          ...activity,
          evaluationCount: activity.evaluationCount + 1,
        }),
      ),
    );
  }
  return activity;
};
