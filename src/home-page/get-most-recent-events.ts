import { GetEvents } from './render-feed';
import { Event, isEditorialCommunityJoinedEvent } from '../types/events';
import FollowList from '../types/follow-list';
import { NonEmptyArray } from '../types/non-empty-array';

export type GetFollowList = () => Promise<FollowList>;

type FilterFunction = (event: Event) => boolean;
export type FilterEvents = (filterFunction: FilterFunction, maxCount: number) => Promise<Array<Event>>;

export default (
  getFollowList: GetFollowList,
  filterEvents: FilterEvents,
  maxCount: number,
): GetEvents => (
  async () => {
    const followList = await getFollowList();
    const followedEvents: FilterFunction = (event) => (
      isEditorialCommunityJoinedEvent(event) || followList.follows(event.actorId)
    );
    return filterEvents(followedEvents, maxCount) as unknown as NonEmptyArray<Event>;
  }
);
