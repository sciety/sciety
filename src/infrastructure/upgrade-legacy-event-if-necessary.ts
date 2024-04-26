import {
  DomainEvent, CurrentOrLegacyDomainEvent, EventOfType,
  LegacyEventOfType,
} from '../domain-events';
import { LegacyDomainEvent } from '../domain-events/current-or-legacy-domain-event';

const upgradeFunctions = {
  EvaluationRecorded: (legacyEvent: LegacyEventOfType<'EvaluationRecorded'>) => ({
    ...legacyEvent,
    type: 'EvaluationPublicationRecorded' as const,
  } satisfies EventOfType<'EvaluationPublicationRecorded'>),
  CurationStatementRecorded: (legacyEvent: LegacyEventOfType<'CurationStatementRecorded'>) => ({
    ...legacyEvent,
    authors: undefined,
    evaluationType: 'curation-statement',
    type: 'EvaluationUpdated' as const,
  } satisfies EventOfType<'EvaluationUpdated'>),
  AnnotationCreated: (legacyEvent: LegacyEventOfType<'AnnotationCreated'>) => ({
    id: legacyEvent.id,
    type: 'ArticleInListAnnotated',
    date: legacyEvent.date,
    content: legacyEvent.content,
    articleId: legacyEvent.target.articleId,
    listId: legacyEvent.target.listId,
  } satisfies EventOfType<'ArticleInListAnnotated'>),
};

const isLegacyDomainEvent = (
  event: CurrentOrLegacyDomainEvent,
): event is LegacyDomainEvent => event.type in upgradeFunctions;

type PickByEventType<Union, EventType> = Union extends { type: EventType } ? Union : never;
type UpgradableEvent<EventType> = PickByEventType<LegacyDomainEvent, EventType>;
type UpgradeFunction<EventType> = (props: UpgradableEvent<EventType>) => DomainEvent;

export const upgradeLegacyEventIfNecessary = (event: CurrentOrLegacyDomainEvent): DomainEvent => {
  if (!isLegacyDomainEvent(event)) {
    return event;
  }
  const selectedFunction = upgradeFunctions[event.type] as UpgradeFunction<typeof event.type>;
  return selectedFunction(event);
};
