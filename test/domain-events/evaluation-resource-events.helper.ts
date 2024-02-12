import { EventOfType, constructEvent } from '../../src/domain-events';
import { arbitraryDate, arbitraryString } from '../helpers';
import { arbitraryEvaluationLocator } from '../types/evaluation-locator.helper';
import { arbitraryEvaluationType } from '../types/evaluation-type.helper';
import { arbitraryExpressionDoi } from '../types/expression-doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';

export const arbitraryEvaluationPublicationRecordedEvent = (): EventOfType<'EvaluationPublicationRecorded'> => constructEvent('EvaluationPublicationRecorded')({
  groupId: arbitraryGroupId(),
  articleId: arbitraryExpressionDoi(),
  evaluationLocator: arbitraryEvaluationLocator(),
  authors: [],
  publishedAt: arbitraryDate(),
  date: arbitraryDate(),
  evaluationType: arbitraryEvaluationType(),
});

export const arbitraryEvaluationRemovalRecordedEvent = (): EventOfType<'EvaluationRemovalRecorded'> => constructEvent('EvaluationRemovalRecorded')({
  evaluationLocator: arbitraryEvaluationLocator(),
  reason: 'published-on-incorrect-article',
});

export const arbitraryEvaluationUpdatedEvent = (): EventOfType<'EvaluationUpdated'> => constructEvent('EvaluationUpdated')({
  evaluationLocator: arbitraryEvaluationLocator(),
  evaluationType: arbitraryEvaluationType(),
  authors: [arbitraryString()],
});
