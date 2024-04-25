import * as A from 'fp-ts/Array';
import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as t from 'io-ts';
import { annotationCreatedEventCodec } from './article-in-list-annotated-event';
import { curationStatementRecordedEventCodec } from './curation-statement-recorded-event';
import { domainEventCodec } from './domain-event-codec';
import { evaluationRecordedEventCodec } from './evaluation-publication-recorded-event';
import { EventId, generate } from '../types/event-id';

const byDate: Ord.Ord<DomainEvent> = pipe(
  D.Ord,
  Ord.contramap((event) => event.date),
);

const byUuid: Ord.Ord<DomainEvent> = pipe(
  S.Ord,
  Ord.contramap((event) => event.id),
);

export const sort = A.sortBy([byDate, byUuid]);

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

export type DomainEvent = t.TypeOf<typeof domainEventCodec>;

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
