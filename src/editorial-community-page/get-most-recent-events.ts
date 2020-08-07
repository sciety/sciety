import { GetEvents } from './render-feed';
import { Event } from '../types/events';

type FilterFunction = (event: Event) => boolean;
export type FilterEvents = (filterFunction: FilterFunction, maxCount: number) => Promise<Array<Event>>;

export default (filterEvents: FilterEvents, maxCount: number): GetEvents => (
  async (editorialCommunityId) => (
    filterEvents((event) => event.actorId.value === editorialCommunityId.value, maxCount)
  )
);
