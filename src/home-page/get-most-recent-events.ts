import { FeedEvent, GetEvents } from './render-feed';
import {
  DomainEvent,
  isEditorialCommunityEndorsedArticleEvent,
  isEditorialCommunityJoinedEvent,
  isEditorialCommunityReviewedArticleEvent,
} from '../types/domain-events';
import { NonEmptyArray } from '../types/non-empty-array';

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;

export default (
  getAllEvents: GetAllEvents,
  maxCount: number,
): GetEvents => (
  async (follows) => {
    const isFollowedEvent = (event: DomainEvent): event is FeedEvent => (
      isEditorialCommunityJoinedEvent(event)
      || (isEditorialCommunityEndorsedArticleEvent(event) && follows(event.editorialCommunityId))
      || (isEditorialCommunityReviewedArticleEvent(event) && follows(event.editorialCommunityId))
    );

    return (await getAllEvents())
      .slice()
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .filter(isFollowedEvent)
      .slice(0, maxCount) as unknown as NonEmptyArray<FeedEvent>;
  }
);
