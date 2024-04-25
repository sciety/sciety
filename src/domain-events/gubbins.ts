import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { annotationCreatedEventCodec } from './article-in-list-annotated-event';
import { curationStatementRecordedEventCodec } from './curation-statement-recorded-event';
import {
  DomainEvent, domainEventCodec, EventName,
} from './domain-event';
import { evaluationRecordedEventCodec } from './evaluation-publication-recorded-event';

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

type SubsetOfDomainEvent<Names extends Array<EventName>> = Extract<DomainEvent, { type: Names[number] }>;

export const filterByName = <T extends Array<EventName>>(names: T) => (
  events: ReadonlyArray<DomainEvent>,
): ReadonlyArray<SubsetOfDomainEvent<T>> => pipe(
  events,
  RA.filter(({ type }) => names.includes(type)),
  RA.map((filtered) => filtered as SubsetOfDomainEvent<T>),
);
