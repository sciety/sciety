import { match } from 'ts-pattern';
import {
  DomainEvent,
  isEditorialCommunityReviewedArticleEvent,
  isUserFollowedEditorialCommunityEvent,
  isUserUnfollowedEditorialCommunityEvent,
} from '../types/domain-events';
import { GroupId } from '../types/group-id';

type GroupMeta = {
  reviewCount: number,
  followerCount: number,
};

export const updateGroupMeta = (groupId: GroupId) => (meta: GroupMeta, event: DomainEvent): GroupMeta => match(event)
  .with({ editorialCommunityId: groupId }, (eventInvolvingThisGroup) => match(eventInvolvingThisGroup)
    .when(isEditorialCommunityReviewedArticleEvent, () => ({ ...meta, reviewCount: meta.reviewCount + 1 }))
    .when(isUserFollowedEditorialCommunityEvent, () => ({ ...meta, followerCount: meta.followerCount + 1 }))
    .when(isUserUnfollowedEditorialCommunityEvent, () => ({ ...meta, followerCount: meta.followerCount - 1 }))
    .otherwise(() => meta))
  .otherwise(() => meta);
