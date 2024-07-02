import * as O from 'fp-ts/Option';
import {
  DomainEvent, CurrentOrLegacyDomainEvent, EventOfType,
  LegacyEventOfType,
} from '../domain-events';

export const upgradeLegacyEventIfNecessary = (event: CurrentOrLegacyDomainEvent): O.Option<DomainEvent> => {
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
  if (event.type === 'EvaluationRecorded') {
    return O.some(upgradeFunctions[event.type](event));
  }
  if (event.type === 'CurationStatementRecorded') {
    return O.some(upgradeFunctions[event.type](event));
  }
  if (event.type === 'AnnotationCreated') {
    return O.some(upgradeFunctions[event.type](event));
  }
  if (event.type === 'SubjectAreaRecorded') {
    return O.none;
  }
  return O.some(event);
};
