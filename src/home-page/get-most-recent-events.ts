import { FeedEvent, GetEvents } from './render-feed';
import {
  DomainEvent,
  isEditorialCommunityEndorsedArticleEvent,
  isEditorialCommunityJoinedEvent,
  isEditorialCommunityReviewedArticleEvent,
} from '../types/domain-events';
import FollowList from '../types/follow-list';
import { NonEmptyArray } from '../types/non-empty-array';

type FilterFunction = (event: DomainEvent) => event is FeedEvent;
export type FilterEvents = (filterFunction: FilterFunction, maxCount: number) => Promise<Array<FeedEvent>>;

export default (
  filterEvents: FilterEvents,
  maxCount: number,
): GetEvents => (
  async (followList: FollowList) => {
    const followedEvents: FilterFunction = (event): event is FeedEvent => (
      isEditorialCommunityJoinedEvent(event)
      || (isEditorialCommunityEndorsedArticleEvent(event) && followList.follows(event.editorialCommunityId))
      || (isEditorialCommunityReviewedArticleEvent(event) && followList.follows(event.actorId))
    );
    return filterEvents(followedEvents, maxCount) as unknown as NonEmptyArray<FeedEvent>;
  }
);
