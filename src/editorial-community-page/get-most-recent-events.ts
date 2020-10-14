import { GetEvents } from './render-feed';
import {
  DomainEvent,
  EditorialCommunityEndorsedArticleEvent,
  EditorialCommunityReviewedArticleEvent,
  isEditorialCommunityEndorsedArticleEvent,
  isEditorialCommunityReviewedArticleEvent,
} from '../types/domain-events';

type FeedEvent =
  EditorialCommunityEndorsedArticleEvent |
  EditorialCommunityReviewedArticleEvent;

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;

export default (getAllEvents: GetAllEvents, maxCount: number): GetEvents<FeedEvent> => (
  async (editorialCommunityId) => (
    (await getAllEvents())
      .slice()
      .reverse()
      .filter((event): event is FeedEvent => (
        (isEditorialCommunityEndorsedArticleEvent(event)
          && event.editorialCommunityId.value === editorialCommunityId.value)
        || (isEditorialCommunityReviewedArticleEvent(event)
          && event.editorialCommunityId.value === editorialCommunityId.value)
      ))
      .slice(0, maxCount)
  )
);
