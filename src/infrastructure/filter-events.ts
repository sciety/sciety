import { Event } from '../types/events';
import { NonEmptyArray } from '../types/non-empty-array';

type FilterFunction = (event: Event) => boolean;
export type FilterEvents = (filterFunction: FilterFunction, maxCount: number) => Promise<Array<Event>>;

export default (
  events: NonEmptyArray<Event>,
): FilterEvents => async (filterFunction, maxCount) => (
  events
    .slice()
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .filter(filterFunction)
    .slice(0, maxCount)
);
