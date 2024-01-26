import { pipe } from 'fp-ts/function';
import * as TO from 'fp-ts/TaskOption';
import { constructRelatedArticles } from '../../../../src/html-pages/paper-activity-page/construct-view-model/construct-related-articles';
import { TestFramework, createTestFramework } from '../../../framework';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { PaperActivitySummaryCardViewModel } from '../../../../src/shared-components/paper-activity-summary-card';

describe('construct-related-articles', () => {
  let framework: TestFramework;
  let result: ReadonlyArray<PaperActivitySummaryCardViewModel>;

  describe('given there are more than 3 possible related articles', () => {
    beforeEach(async () => {
      framework = createTestFramework();
      result = await pipe(
        constructRelatedArticles(arbitraryExpressionDoi(), framework.dependenciesForViews),
        TO.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns 3 items', () => {
      expect(result).toHaveLength(3);
    });
  });
});
