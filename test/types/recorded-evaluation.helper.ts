import * as O from 'fp-ts/Option';
import { arbitraryEvaluationLocator } from './evaluation-locator.helper';
import { arbitraryEvaluationType } from './evaluation-type.helper';
import { arbitraryExpressionDoi } from './expression-doi.helper';
import { arbitraryGroupId } from './group-id.helper';
import { RecordedEvaluation } from '../../src/types/recorded-evaluation';
import { arbitraryDate, arbitraryString } from '../helpers';

export const arbitraryRecordedEvaluation = (): RecordedEvaluation => ({
  expressionDoi: arbitraryExpressionDoi(),
  groupId: arbitraryGroupId(),
  evaluationLocator: arbitraryEvaluationLocator(),
  publishedAt: arbitraryDate(),
  authors: [arbitraryString()],
  recordedAt: arbitraryDate(),
  updatedAt: arbitraryDate(),
  type: O.some(arbitraryEvaluationType()),
});
