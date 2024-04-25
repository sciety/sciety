import {
  DomainEvent, CurrentOrLegacyDomainEvent, EventOfType,
} from '../domain-events';

export const upgradeLegacyEventIfNecessary = (event: CurrentOrLegacyDomainEvent): DomainEvent => {
  if (event.type === 'EvaluationRecorded') {
    return {
      ...event,
      type: 'EvaluationPublicationRecorded' as const,
    };
  }
  if (event.type === 'CurationStatementRecorded') {
    return {
      ...event,
      authors: undefined,
      evaluationType: 'curation-statement',
      type: 'EvaluationUpdated' as const,
    } satisfies EventOfType<'EvaluationUpdated'>;
  }
  if (event.type === 'AnnotationCreated') {
    return {
      id: event.id,
      type: 'ArticleInListAnnotated',
      date: event.date,
      content: event.content,
      articleId: event.target.articleId,
      listId: event.target.listId,
    };
  }
  return event;
};
