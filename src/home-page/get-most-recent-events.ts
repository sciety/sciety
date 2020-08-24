import { FeedEvent, GetEvents } from './render-feed';
import {
  DomainEvent,
  isEditorialCommunityEndorsedArticleEvent,
  isEditorialCommunityJoinedEvent,
  isEditorialCommunityReviewedArticleEvent,
} from '../types/domain-events';
import { Follows } from '../types/follows';
import { NonEmptyArray } from '../types/non-empty-array';

type FilterFunction = (event: DomainEvent) => event is FeedEvent;
export type FilterEvents = (filterFunction: FilterFunction, maxCount: number) => Promise<Array<FeedEvent>>;

export default (
  filterEvents: FilterEvents,
  maxCount: number,
): GetEvents => (
  async (follows: Follows) => {
    const followedEvents: FilterFunction = (event): event is FeedEvent => (
      isEditorialCommunityJoinedEvent(event)
      || (isEditorialCommunityEndorsedArticleEvent(event) && follows(event.editorialCommunityId))
      || (isEditorialCommunityReviewedArticleEvent(event) && follows(event.editorialCommunityId))
    );
    return filterEvents(followedEvents, maxCount) as unknown as NonEmptyArray<FeedEvent>;
  }
);
