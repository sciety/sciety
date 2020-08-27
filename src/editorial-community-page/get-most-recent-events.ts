import { FeedEvent, GetEvents } from './render-feed';
import {
  DomainEvent,
  isEditorialCommunityEndorsedArticleEvent,
  isEditorialCommunityJoinedEvent,
  isEditorialCommunityReviewedArticleEvent,
} from '../types/domain-events';

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;

export default (getAllEvents: GetAllEvents, maxCount: number): GetEvents => (
  async (editorialCommunityId) => (
    (await getAllEvents())
      .slice()
      .reverse()
      .filter((event): event is FeedEvent => (
        (isEditorialCommunityEndorsedArticleEvent(event)
          && event.editorialCommunityId.value === editorialCommunityId.value)
        || (isEditorialCommunityReviewedArticleEvent(event)
          && event.editorialCommunityId.value === editorialCommunityId.value)
        || (isEditorialCommunityJoinedEvent(event)
          && event.editorialCommunityId.value === editorialCommunityId.value)
      ))
      .slice(0, maxCount)
  )
);
