import * as RA from 'fp-ts/ReadonlyArray';
import {
  DomainEvent,
  isEditorialCommunityReviewedArticleEvent,
  isUserFollowedEditorialCommunityEvent,
  isUserUnfollowedEditorialCommunityEvent,
} from '../types/domain-events';

import { GroupId } from '../types/group-id';

const reviewCounter = (groupId: GroupId, events: ReadonlyArray<DomainEvent>): number => events.filter(
  (event) => isEditorialCommunityReviewedArticleEvent(event)
    && event.editorialCommunityId.value === groupId.value,
).length;

type Reducer = (groupId: GroupId) => (count: number, event: DomainEvent) => number;

const followerCounter: Reducer = (groupId) => (count, event) => {
  if (isUserFollowedEditorialCommunityEvent(event) && event.editorialCommunityId.value === groupId.value) {
    return count + 1;
  }
  if (isUserUnfollowedEditorialCommunityEvent(event) && event.editorialCommunityId.value === groupId.value) {
    return count - 1;
  }
  return count;
};

type ProjectGroupMeta = (groupId: GroupId) => (events: ReadonlyArray<DomainEvent>) => {
  reviewCount: number,
  followerCount: number,
};

export const projectGroupMeta: ProjectGroupMeta = (groupId) => (events) => ({
  reviewCount: reviewCounter(groupId, events),
  followerCount: RA.reduce(0, followerCounter(groupId))(events),
});
