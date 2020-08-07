import { DomainEvent } from '../types/domain-events';
import { NonEmptyArray } from '../types/non-empty-array';

type FilterFunction = (event: DomainEvent) => boolean;
export type FilterEvents = (filterFunction: FilterFunction, maxCount: number) => Promise<Array<DomainEvent>>;

export default (
  events: NonEmptyArray<DomainEvent>,
): FilterEvents => async (filterFunction, maxCount) => (
  events
    .slice()
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .filter(filterFunction)
    .slice(0, maxCount)
);
