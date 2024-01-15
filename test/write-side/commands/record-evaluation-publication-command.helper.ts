import { RecordEvaluationPublicationCommand } from '../../../src/write-side/commands';
import { arbitraryDate, arbitraryString } from '../../helpers';
import { arbitraryArticleId, toExpressionDoi } from '../../types/article-id.helper';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';

export const arbitraryRecordEvaluationPublicationCommand = (): RecordEvaluationPublicationCommand => ({
  groupId: arbitraryGroupId(),
  publishedAt: arbitraryDate(),
  evaluationLocator: arbitraryEvaluationLocator(),
  articleId: toExpressionDoi(arbitraryArticleId()),
  authors: [arbitraryString(), arbitraryString()],
});
