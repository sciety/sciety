import {
  DomainEvent, CurrentOrLegacyDomainEvent, EventOfType,
} from '../domain-events';
import { isEventOfSubset } from '../domain-events/current-or-legacy-domain-event';

const isUpgradableEvent = isEventOfSubset(['EvaluationRecorded', 'CurationStatementRecorded', 'AnnotationCreated']);

export const upgradeLegacyEventIfNecessary = (event: CurrentOrLegacyDomainEvent): DomainEvent => {
  if (!isUpgradableEvent(event)) {
    return event;
  }

  switch (event.type) {
    case 'EvaluationRecorded':
      return ({
        ...event,
        type: 'EvaluationPublicationRecorded' as const,
      } satisfies EventOfType<'EvaluationPublicationRecorded'>);
    case 'CurationStatementRecorded':
      return ({
        ...event,
        authors: undefined,
        evaluationType: 'curation-statement',
        type: 'EvaluationUpdated' as const,
      } satisfies EventOfType<'EvaluationUpdated'>);
    case 'AnnotationCreated':
      return ({
        id: event.id,
        type: 'ArticleInListAnnotated',
        date: event.date,
        content: event.content,
        articleId: event.target.articleId,
        listId: event.target.listId,
      }) satisfies EventOfType<'ArticleInListAnnotated'>;
  }
};
