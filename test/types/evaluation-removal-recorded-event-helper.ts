import { constructEvent, EventOfType } from '../../src/domain-events';
import { arbitraryEvaluationLocator } from './evaluation-locator.helper';

export const arbitraryEvaluationRemovalRecordedEvent = (): EventOfType<'EvaluationRemovalRecorded'> => constructEvent('EvaluationRemovalRecorded')({
  evaluationLocator: arbitraryEvaluationLocator(),
  reason: 'published-on-incorrect-article',
});
