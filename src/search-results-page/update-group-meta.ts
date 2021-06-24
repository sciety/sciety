import { match } from 'ts-pattern';
import {
  DomainEvent,
} from '../types/domain-events';
import { GroupId } from '../types/group-id';

type GroupMeta = {
  reviewCount: number,
  followerCount: number,
};

export const updateGroupMeta = (groupId: GroupId) => (meta: GroupMeta, event: DomainEvent): GroupMeta => match(event)
  .with(
    { type: 'EditorialCommunityReviewedArticle', editorialCommunityId: groupId },
    () => ({ ...meta, reviewCount: meta.reviewCount + 1 }),
  )
  .with(
    { type: 'UserFollowedEditorialCommunity', editorialCommunityId: groupId },
    () => ({ ...meta, followerCount: meta.followerCount + 1 }),
  )
  .with(
    { type: 'UserUnfollowedEditorialCommunity', editorialCommunityId: groupId },
    () => ({ ...meta, followerCount: meta.followerCount - 1 }),
  )
  .otherwise(() => meta);
