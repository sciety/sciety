import * as O from 'fp-ts/Option';
import { arbitraryGroupId } from './group-id.helper';
import { arbitraryDate, arbitraryString } from '../helpers';
import { RecordedEvaluation } from '../../src/types/recorded-evaluation';
import { arbitraryArticleId } from './article-id.helper';
import { arbitraryEvaluationLocator } from './evaluation-locator.helper';
import { arbitraryEvaluationType } from './evaluation-type.helper';

export const arbitraryRecordedEvaluation = (): RecordedEvaluation => ({
  articleId: arbitraryArticleId(),
  groupId: arbitraryGroupId(),
  evaluationLocator: arbitraryEvaluationLocator(),
  publishedAt: arbitraryDate(),
  authors: [arbitraryString()],
  recordedAt: arbitraryDate(),
  updatedAt: arbitraryDate(),
  type: O.some(arbitraryEvaluationType()),
});
