import * as t from 'io-ts';
import { annotationCreatedEventCodec } from './article-in-list-annotated-event';
import { curationStatementRecordedEventCodec } from './curation-statement-recorded-event';
import {
  domainEventCodec,
} from './domain-event';
import { evaluationRecordedEventCodec } from './evaluation-publication-recorded-event';

const legacyDomainEventCodec = t.union([
  evaluationRecordedEventCodec,
  curationStatementRecordedEventCodec,
  annotationCreatedEventCodec,
], 'type');

type LegacyDomainEvent = t.TypeOf<typeof legacyDomainEventCodec>;

type LegacyEventName = LegacyDomainEvent['type'];

export type LegacyEventOfType<T extends LegacyEventName> = LegacyDomainEvent & { 'type': T };

export const currentOrLegacyDomainEventCodec = t.union([
  domainEventCodec,
  legacyDomainEventCodec,
], 'type');

export type CurrentOrLegacyDomainEvent = t.TypeOf<typeof currentOrLegacyDomainEventCodec>;

type SubsetOfEvent<Names extends Array<CurrentOrLegacyDomainEvent['type']>> = Extract<CurrentOrLegacyDomainEvent, { type: Names[number] }>;

export const isEventOfSubset = <T extends Array<CurrentOrLegacyDomainEvent['type']>>(names: T) => (event: CurrentOrLegacyDomainEvent): event is SubsetOfEvent<T> => names.includes(event.type);
