import { GetEvents } from './render-feed';
import { DomainEvent } from '../types/domain-events';

type FilterFunction = (event: DomainEvent) => boolean;
export type FilterEvents = (filterFunction: FilterFunction, maxCount: number) => Promise<Array<DomainEvent>>;

export default (filterEvents: FilterEvents, maxCount: number): GetEvents => (
  async (editorialCommunityId) => (
    filterEvents((event) => event.actorId.value === editorialCommunityId.value, maxCount)
  )
);
