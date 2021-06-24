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
  .with(
    { editorialCommunityId: groupId }, isEditorialCommunityReviewedArticleEvent,
    () => ({ ...meta, reviewCount: meta.reviewCount + 1 }),
  )
  .with(
    { editorialCommunityId: groupId }, isUserFollowedEditorialCommunityEvent,
    () => ({ ...meta, followerCount: meta.followerCount + 1 }),
  )
  .with(
    { editorialCommunityId: groupId }, isUserUnfollowedEditorialCommunityEvent,
    () => ({ ...meta, followerCount: meta.followerCount - 1 }),
  )
  .otherwise(() => meta);
