import { EventOfType, constructEvent } from '../../src/domain-events';
import { arbitraryDate } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryEvaluationLocator } from '../types/evaluation-locator.helper';
import { arbitraryEvaluationType } from '../types/evaluation-type.helper';
import { arbitraryGroupId } from '../types/group-id.helper';

export const arbitraryEvaluationPublicationRecordedEvent = (): EventOfType<'EvaluationPublicationRecorded'> => constructEvent('EvaluationPublicationRecorded')({
  groupId: arbitraryGroupId(),
  articleId: arbitraryArticleId(),
  evaluationLocator: arbitraryEvaluationLocator(),
  authors: [],
  publishedAt: arbitraryDate(),
  date: arbitraryDate(),
  evaluationType: arbitraryEvaluationType(),
});
