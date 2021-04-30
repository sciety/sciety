import * as T from 'fp-ts/Task';
import {
  DomainEvent,
  EditorialCommunityReviewedArticleEvent,
  isEditorialCommunityReviewedArticleEvent,
} from '../../types/domain-events';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type GetEvents<E> = (userId: UserId) => T.Task<ReadonlyArray<E>>;

type Follows = (u: UserId, g: GroupId) => T.Task<boolean>;

export const getMostRecentEvents = (
  getAllEvents: GetAllEvents,
  follows: Follows,
  maxCount: number,
): GetEvents<EditorialCommunityReviewedArticleEvent> => (
  (userId) => async () => {
    const isFollowedEvent = async (event: DomainEvent) => {
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
