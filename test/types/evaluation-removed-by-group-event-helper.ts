import { constructEvent, EventOfType } from '../../src/domain-events';
import { arbitraryEvaluationLocator } from './evaluation-locator.helper';

export const arbitraryEvaluationRemovedByGroupEvent = (): EventOfType<'EvaluationRemovedByGroup'> => constructEvent('EvaluationRemovedByGroup')({
  evaluationLocator: arbitraryEvaluationLocator(),
  reason: 'published-on-incorrect-article',
});
