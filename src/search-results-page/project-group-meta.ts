import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  DomainEvent,
  isEditorialCommunityReviewedArticleEvent,
  isUserFollowedEditorialCommunityEvent,
  isUserUnfollowedEditorialCommunityEvent,
} from '../types/domain-events';
import { GroupId } from '../types/group-id';

const reducer = (groupId: GroupId) => (meta: GroupMeta, event: DomainEvent) => {
  if (isUserFollowedEditorialCommunityEvent(event) && event.editorialCommunityId.value === groupId.value) {
    return {
      ...meta,
      followerCount: meta.followerCount + 1,
    };
  }
  if (isUserUnfollowedEditorialCommunityEvent(event) && event.editorialCommunityId.value === groupId.value) {
    return {
      ...meta,
      followerCount: meta.followerCount - 1,
    };
  }
  if (isEditorialCommunityReviewedArticleEvent(event) && event.editorialCommunityId.value === groupId.value) {
    return {
      ...meta,
      reviewCount: meta.reviewCount + 1,
    };
  }
  return meta;
};

type GroupMeta = {
  reviewCount: number,
  followerCount: number,
};

type ProjectGroupMeta = (events: ReadonlyArray<DomainEvent>) => (groupId: GroupId) => GroupMeta;

export const projectGroupMeta: ProjectGroupMeta = (events) => (groupId) => pipe(
  events,
  RA.reduce({
    reviewCount: 0,
    followerCount: 0,
  }, reducer(groupId)),
);
