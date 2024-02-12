import { RecordEvaluationPublicationCommand } from '../../../src/write-side/commands';
import { arbitraryDate, arbitraryString } from '../../helpers';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';

export const arbitraryRecordEvaluationPublicationCommand = (): RecordEvaluationPublicationCommand => ({
  groupId: arbitraryGroupId(),
  publishedAt: arbitraryDate(),
  evaluationLocator: arbitraryEvaluationLocator(),
  expressionDoi: arbitraryExpressionDoi(),
  authors: [arbitraryString(), arbitraryString()],
});
