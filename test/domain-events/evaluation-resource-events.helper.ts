import { EventOfType, constructEvent } from '../../src/domain-events/index.js';
import { arbitraryDate, arbitraryString } from '../helpers.js';
import { arbitraryArticleId } from '../types/article-id.helper.js';
import { arbitraryEvaluationLocator } from '../types/evaluation-locator.helper.js';
import { arbitraryEvaluationType } from '../types/evaluation-type.helper.js';
import { arbitraryGroupId } from '../types/group-id.helper.js';

export const arbitraryEvaluationPublicationRecordedEvent = (): EventOfType<'EvaluationPublicationRecorded'> => constructEvent('EvaluationPublicationRecorded')({
  groupId: arbitraryGroupId(),
  articleId: arbitraryArticleId(),
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
