import { EventOfType, constructEvent } from '../../src/domain-events';
import { arbitraryDate } from '../helpers';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryEvaluationLocator } from '../types/evaluation-locator.helper';
import { arbitraryEvaluationType } from '../types/evaluation-type.helper';
import { arbitraryGroupId } from '../types/group-id.helper';

export const arbitraryEvaluationRecordedEvent = (): EventOfType<'EvaluationRecorded'> => constructEvent('EvaluationRecorded')({
  groupId: arbitraryGroupId(),
  articleId: arbitraryDoi(),
  evaluationLocator: arbitraryEvaluationLocator(),
  authors: [],
  publishedAt: arbitraryDate(),
  date: arbitraryDate(),
  evaluationType: arbitraryEvaluationType(),
});

export const arbitraryEvaluationPublicationRecordedEvent = (): EventOfType<'EvaluationPublicationRecorded'> => constructEvent('EvaluationPublicationRecorded')({
  groupId: arbitraryGroupId(),
  articleId: arbitraryDoi(),
  evaluationLocator: arbitraryEvaluationLocator(),
  authors: [],
  publishedAt: arbitraryDate(),
  date: arbitraryDate(),
  evaluationType: arbitraryEvaluationType(),
});
