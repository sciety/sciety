import { FeedEvent, GetEvents } from './render-feed';
import {
  DomainEvent,
  isEditorialCommunityEndorsedArticleEvent,
  isEditorialCommunityJoinedEvent,
  isEditorialCommunityReviewedArticleEvent,
} from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import { NonEmptyArray } from '../types/non-empty-array';
import { UserId } from '../types/user-id';

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;
type Follows = (userId: UserId, editorialCommunityId: EditorialCommunityId) => Promise<boolean>;

export default (
  getAllEvents: GetAllEvents,
  follows: Follows,
  maxCount: number,
): GetEvents => (
  async (userId: UserId) => {
    const isFollowedEvent = async (event: DomainEvent): Promise<boolean> => {
      if (isEditorialCommunityJoinedEvent(event)) {
        return true;
      }
      const userFollows = await follows(userId, event.editorialCommunityId);
      return (isEditorialCommunityEndorsedArticleEvent(event) && userFollows)
        || (isEditorialCommunityReviewedArticleEvent(event) && userFollows);
    };

    const allEvents = (await getAllEvents())
      .slice()
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    const filtering = await Promise.all(allEvents.map(isFollowedEvent));
    return allEvents.filter((_, i) => filtering[i])
      .slice(0, maxCount) as unknown as NonEmptyArray<FeedEvent>;
  }
);
