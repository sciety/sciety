import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { annotationCreatedEventCodec } from './article-in-list-annotated-event';
import { curationStatementRecordedEventCodec } from './curation-statement-recorded-event';
import { DomainEvent, domainEventCodec } from './domain-event';
import { evaluationRecordedEventCodec } from './evaluation-publication-recorded-event';
import { EventId, generate } from '../types/event-id';

const legacyDomainEventCodec = t.union([
  evaluationRecordedEventCodec,
  curationStatementRecordedEventCodec,
  annotationCreatedEventCodec,
], 'type');

export const currentOrLegacyDomainEventCodec = t.union([
  domainEventCodec,
  legacyDomainEventCodec,
], 'type');

export type CurrentOrLegacyDomainEvent = t.TypeOf<typeof currentOrLegacyDomainEventCodec>;

type EventName = DomainEvent['type'];

export type EventOfType<T extends EventName> = DomainEvent & { 'type': T };

export const isEventOfType = <T extends EventName>(name: T) => (
  event: DomainEvent,
): event is EventOfType<T> => event.type === name;

type EventSpecificFields<T extends EventName> = Omit<EventOfType<T>, 'type' | 'id' | 'date'>;

type EventBase<T> = {
  id: EventId,
  date: Date,
  type: T,
};

export const constructEvent = <
T extends EventName,
A extends EventSpecificFields<T>,
>(type: T) => (args: A & Partial<{ date: Date }>): EventBase<T> & A => ({
    type,
    id: generate(),
    date: new Date(),
    ...args,
  });

type SubsetOfDomainEvent<Names extends Array<EventName>> = Extract<DomainEvent, { type: Names[number] }>;

export const filterByName = <T extends Array<EventName>>(names: T) => (
  events: ReadonlyArray<DomainEvent>,
): ReadonlyArray<SubsetOfDomainEvent<T>> => pipe(
  events,
  RA.filter(({ type }) => names.includes(type)),
  RA.map((filtered) => filtered as SubsetOfDomainEvent<T>),
);
