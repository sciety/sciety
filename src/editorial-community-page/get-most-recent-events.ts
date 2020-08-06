import { GetEvents } from './render-feed';
import { Event } from '../types/events';
import FollowList from '../types/follow-list';

type FilterFunction = (event: Event) => boolean;
type FilterEvents = (filterFunction: FilterFunction, maxCount: number) => Promise<Array<Event>>;

export default (filterEvents: FilterEvents, maxCount: number): GetEvents => (
  async (editorialCommunityId) => {
    const followList = new FollowList([editorialCommunityId]);
    return filterEvents((event) => followList.follows(event.actorId), maxCount);
  }
);
