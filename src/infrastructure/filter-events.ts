import events from '../data/bootstrap-events';
import { Event } from '../types/events';

type FilterFunction = (event: Event) => boolean;
export type FilterEvents = (filterFunction: FilterFunction, maxCount: number) => Promise<Array<Event>>;

const filterEvents: FilterEvents = async (filterFunction, maxCount) => (
  events
    .slice()
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .filter(filterFunction)
    .slice(0, maxCount)
);

export default filterEvents;
