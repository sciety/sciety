import { RecordEvaluationPublicationCommand } from '../../../src/write-side/commands/index.js';
import { arbitraryDate, arbitraryString } from '../../helpers.js';
import { arbitraryArticleId } from '../../types/article-id.helper.js';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper.js';
import { arbitraryGroupId } from '../../types/group-id.helper.js';

export const arbitraryRecordEvaluationPublicationCommand = (): RecordEvaluationPublicationCommand => ({
  groupId: arbitraryGroupId(),
  publishedAt: arbitraryDate(),
  evaluationLocator: arbitraryEvaluationLocator(),
  articleId: arbitraryArticleId(),
  authors: [arbitraryString(), arbitraryString()],
});
