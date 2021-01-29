import * as T from 'fp-ts/Task';
import { GetEvents } from './render-feed';
import {
  DomainEvent,
  EditorialCommunityReviewedArticleEvent,
  isEditorialCommunityReviewedArticleEvent,
} from '../types/domain-events';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;
export type Follows = (userId: UserId, editorialCommunityId: EditorialCommunityId) => T.Task<boolean>;

export const getMostRecentEvents = (
  getAllEvents: GetAllEvents,
  follows: Follows,
  maxCount: number,
): GetEvents<EditorialCommunityReviewedArticleEvent> => (
  (userId) => async () => {
    const isFollowedEvent = async (event: DomainEvent): Promise<boolean> => {
      if (!('editorialCommunityId' in event)) {
        return false;
      }

      const userFollows = await follows(userId, event.editorialCommunityId)();

      return isEditorialCommunityReviewedArticleEvent(event) && userFollows;
    };

    const allEvents = (await getAllEvents())
      .slice()
      .reverse();
    const filtering = await Promise.all(allEvents.map(isFollowedEvent));
    return allEvents.filter((event, i): event is EditorialCommunityReviewedArticleEvent => filtering[i])
      .slice(0, maxCount);
  }
);
