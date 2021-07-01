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
  latestActivityDate: Date,
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
    if (event.date > meta.latestActivityDate) {
      return {
        ...meta,
        reviewCount: meta.reviewCount + 1,
        latestActivityDate: event.date,
      };
    }
    return {
      ...meta,
      reviewCount: meta.reviewCount + 1,
    };
  }
  return meta;
};
