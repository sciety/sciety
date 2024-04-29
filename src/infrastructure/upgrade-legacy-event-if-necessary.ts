import {
  DomainEvent, CurrentOrLegacyDomainEvent, EventOfType,
  LegacyEventOfType,
} from '../domain-events';
import { isEventOfSubset } from '../domain-events/current-or-legacy-domain-event';

const isUpgradableEvent = isEventOfSubset(['EvaluationRecorded', 'CurationStatementRecorded', 'AnnotationCreated']);

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

export const upgradeLegacyEventIfNecessary = (event: CurrentOrLegacyDomainEvent): DomainEvent => {
  if (!isUpgradableEvent(event)) {
    return event;
  }

  switch (event.type) {
    case 'EvaluationRecorded':
      return upgradeFunctions.EvaluationRecorded(event);
    case 'AnnotationCreated':
      return upgradeFunctions.AnnotationCreated(event);
    case 'CurationStatementRecorded':
      return upgradeFunctions.CurationStatementRecorded(event);
  }
};
