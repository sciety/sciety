import { DomainEvent } from '../types/domain-events';

type FilterFunction<T extends DomainEvent> = (event: DomainEvent) => event is T;

export type FilterEvents = <T extends DomainEvent>(filterFunction: FilterFunction<T>, maxCount: number)
  => Promise<Array<T>>;

export default (
  events: Array<DomainEvent>,
): FilterEvents => async (filterFunction, maxCount) => (
  events
    .slice()
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .filter(filterFunction)
    .slice(0, maxCount)
);
