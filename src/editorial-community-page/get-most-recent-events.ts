import { FeedEvent, GetEvents } from './render-feed';
import {
  DomainEvent,
  isEditorialCommunityEndorsedArticleEvent,
  isEditorialCommunityJoinedEvent,
  isEditorialCommunityReviewedArticleEvent,
} from '../types/domain-events';

type FilterFunction = (event: DomainEvent) => event is FeedEvent;
export type FilterEvents = (filterFunction: FilterFunction, maxCount: number) => Promise<Array<FeedEvent>>;

export default (filterEvents: FilterEvents, maxCount: number): GetEvents => (
  async (editorialCommunityId) => (
    filterEvents(
      (event): event is FeedEvent => (
        (isEditorialCommunityEndorsedArticleEvent(event)
          && event.editorialCommunityId.value === editorialCommunityId.value)
        || (isEditorialCommunityReviewedArticleEvent(event)
          && event.actorId.value === editorialCommunityId.value)
        || (isEditorialCommunityJoinedEvent(event)
          && event.actorId.value === editorialCommunityId.value)
      ),
      maxCount,
    )
  )
);
