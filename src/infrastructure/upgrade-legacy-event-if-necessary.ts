import * as O from 'fp-ts/Option';
import {
  DomainEvent, CurrentOrLegacyDomainEvent, EventOfType,
  LegacyEventOfType,
} from '../domain-events';
import * as EDOI from '../types/expression-doi';

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
      type: 'ExpressionInListAnnotated',
      date: legacyEvent.date,
      content: legacyEvent.content,
      expressionDoi: EDOI.fromValidatedString(legacyEvent.target.articleId.value),
      listId: legacyEvent.target.listId,
    } satisfies EventOfType<'ExpressionInListAnnotated'>),
    ArticleAddedToList: (legacyEvent: LegacyEventOfType<'ArticleAddedToList'>) => ({
      id: legacyEvent.id,
      type: 'ExpressionAddedToList',
      date: legacyEvent.date,
      expressionDoi: EDOI.fromValidatedString(legacyEvent.articleId.value),
      listId: legacyEvent.listId,
    } satisfies EventOfType<'ExpressionAddedToList'>),
    ArticleInListAnnotated: (legacyEvent: LegacyEventOfType<'ArticleInListAnnotated'>) => ({
      ...legacyEvent,
      type: 'ExpressionInListAnnotated',
      expressionDoi: EDOI.fromValidatedString(legacyEvent.articleId.value),
    } satisfies EventOfType<'ExpressionInListAnnotated'>),
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
  if (event.type === 'ArticleAddedToList') {
    return O.some(upgradeFunctions[event.type](event));
  }
  if (event.type === 'ArticleInListAnnotated') {
    return O.some(upgradeFunctions[event.type](event));
  }
  return O.some(event);
};
