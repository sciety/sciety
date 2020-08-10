import { GetEvents } from './render-feed';
import { DomainEvent, isEditorialCommunityJoinedEvent } from '../types/domain-events';
import FollowList from '../types/follow-list';
import { NonEmptyArray } from '../types/non-empty-array';

type FilterFunction = (event: DomainEvent) => boolean;
export type FilterEvents = (filterFunction: FilterFunction, maxCount: number) => Promise<Array<DomainEvent>>;

export default (
  filterEvents: FilterEvents,
  maxCount: number,
): GetEvents => (
  async (followList: FollowList) => {
    const followedEvents: FilterFunction = (event) => (
      isEditorialCommunityJoinedEvent(event) || followList.follows(event.actorId)
    );
    return filterEvents(followedEvents, maxCount) as unknown as NonEmptyArray<DomainEvent>;
  }
);
