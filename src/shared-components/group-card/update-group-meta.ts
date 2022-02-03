import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import {
  DomainEvent,
  isEvaluationRecordedEvent,
  isUserFollowedEditorialCommunityEvent,
  isUserUnfollowedEditorialCommunityEvent,
} from '../../domain-events';
import { GroupId } from '../../types/group-id';

type GroupMeta = {
  evaluationCount: number,
  followerCount: number,
  latestActivity: O.Option<Date>,
};

export const updateGroupMeta = (groupId: GroupId) => (meta: GroupMeta, event: DomainEvent): GroupMeta => {
  if (isUserFollowedEditorialCommunityEvent(event) && event.editorialCommunityId === groupId) {
    return {
      ...meta,
      followerCount: meta.followerCount + 1,
    };
  }
  if (isUserUnfollowedEditorialCommunityEvent(event) && event.editorialCommunityId === groupId) {
    return {
      ...meta,
      followerCount: meta.followerCount - 1,
    };
  }
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
