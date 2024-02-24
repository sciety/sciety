import { RecordEvaluationPublicationCommand } from '../../../src/write-side/commands/index.js';
import { arbitraryDate, arbitraryString } from '../../helpers.js';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper.js';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper.js';
import { arbitraryGroupId } from '../../types/group-id.helper.js';

export const arbitraryRecordEvaluationPublicationCommand = (): RecordEvaluationPublicationCommand => ({
  groupId: arbitraryGroupId(),
  publishedAt: arbitraryDate(),
  evaluationLocator: arbitraryEvaluationLocator(),
  expressionDoi: arbitraryExpressionDoi(),
  authors: [arbitraryString(), arbitraryString()],
});
