import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import {
  DomainEvent,
  isEditorialCommunityReviewedArticleEvent,
  isUserFollowedEditorialCommunityEvent,
  isUserUnfollowedEditorialCommunityEvent,
} from '../../types/domain-events';
import { GroupId } from '../../types/group-id';

type GroupMeta = {
  reviewCount: number,
  followerCount: number,
  latestActivityDate: O.Option<Date>,
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
  if (isEditorialCommunityReviewedArticleEvent(event) && event.editorialCommunityId === groupId) {
    return pipe(
      meta.latestActivityDate,
      O.fold(
        () => ({
          ...meta,
          reviewCount: meta.reviewCount + 1,
          latestActivityDate: O.some(event.date),
        }),
        (date) => (event.date > date ? {
          ...meta,
          reviewCount: meta.reviewCount + 1,
          latestActivityDate: O.some(event.date),
        } : {
          ...meta,
          reviewCount: meta.reviewCount + 1,
        }),
      ),
    );
  }
  return meta;
};
