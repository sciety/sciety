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
  reviewCount: number,
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
          reviewCount: meta.reviewCount + 1,
          latestActivity: O.some(event.date),
        }),
        (date) => (event.date > date ? {
          ...meta,
          reviewCount: meta.reviewCount + 1,
          latestActivity: O.some(event.date),
        } : {
          ...meta,
          reviewCount: meta.reviewCount + 1,
        }),
      ),
    );
  }
  return meta;
};
