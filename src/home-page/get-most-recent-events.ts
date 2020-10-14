import { GetEvents } from './render-feed';
import {
  DomainEvent,
  EditorialCommunityEndorsedArticleEvent,
  EditorialCommunityReviewedArticleEvent,
  isEditorialCommunityEndorsedArticleEvent,
  isEditorialCommunityReviewedArticleEvent,
} from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

type FeedEvent =
  EditorialCommunityEndorsedArticleEvent |
  EditorialCommunityReviewedArticleEvent;

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;
export type Follows = (userId: UserId, editorialCommunityId: EditorialCommunityId) => Promise<boolean>;

export default (
  getAllEvents: GetAllEvents,
  follows: Follows,
  maxCount: number,
): GetEvents<FeedEvent> => (
  async (userId) => {
    const isFollowedEvent = async (event: DomainEvent): Promise<boolean> => {
      const userFollows = await follows(userId, event.editorialCommunityId);

      return (isEditorialCommunityEndorsedArticleEvent(event) && userFollows)
        || (isEditorialCommunityReviewedArticleEvent(event) && userFollows);
    };

    const allEvents = (await getAllEvents())
      .slice()
      .reverse();
    const filtering = await Promise.all(allEvents.map(isFollowedEvent));
    return allEvents.filter((event, i): event is FeedEvent => filtering[i])
      .slice(0, maxCount);
  }
);
