import { pipe } from 'fp-ts/function';
import * as TO from 'fp-ts/TaskOption';
import { constructRelatedArticles } from '../../../../src/html-pages/paper-activity-page/construct-view-model/construct-related-articles.js';
import { TestFramework, createTestFramework } from '../../../framework/index.js';
import { shouldNotBeCalled } from '../../../should-not-be-called.js';
import { PaperActivitySummaryCardViewModel } from '../../../../src/shared-components/paper-activity-summary-card/index.js';
import { arbitraryPublishingHistoryOnlyPreprints } from '../../../types/publishing-history.helper.js';

describe('construct-related-articles', () => {
  let framework: TestFramework;
  let result: ReadonlyArray<PaperActivitySummaryCardViewModel>;

  describe('given there are more than 3 possible related articles', () => {
    beforeEach(async () => {
      framework = createTestFramework();
      result = await pipe(
        constructRelatedArticles(arbitraryPublishingHistoryOnlyPreprints(), framework.dependenciesForViews),
        TO.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns 3 items', () => {
      expect(result).toHaveLength(3);
    });
  });
});
