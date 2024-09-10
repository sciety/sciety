import * as O from 'fp-ts/Option';
import { RecordedEvaluation } from '../../../src/read-models/evaluations/recorded-evaluation';
import { arbitraryDate, arbitraryString } from '../../helpers';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitraryEvaluationType } from '../../types/evaluation-type.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';

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
