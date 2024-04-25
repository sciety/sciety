import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, EventName } from './domain-event';

type SubsetOfDomainEvent<Names extends Array<EventName>> = Extract<DomainEvent, { type: Names[number] }>;

export const filterByName = <T extends Array<EventName>>(names: T) => (
  events: ReadonlyArray<DomainEvent>,
): ReadonlyArray<SubsetOfDomainEvent<T>> => pipe(
  events,
  RA.filter(({ type }) => names.includes(type)),
  RA.map((filtered) => filtered as SubsetOfDomainEvent<T>),
);
