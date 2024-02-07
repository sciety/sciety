import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { TestFramework, createTestFramework } from '../../framework';
import { ConstructPageResult } from '../../../src/html-pages/construct-page';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryPublishingHistoryOnlyPreprints } from '../../types/publishing-history.helper';
import { ExpressionDoi } from '../../../src/types/expression-doi';
import { Dependencies } from '../../../src/html-pages/paper-activity-page/construct-view-model/dependencies';
import { paperActivityPage } from '../../../src/html-pages/paper-activity-page/paper-activity-page';

const getDecision = async (expressionDoi: ExpressionDoi, dependencies: Dependencies) => pipe(
  {
    expressionDoi: expressionDoi.toString(),
  },
  paperActivityPage(dependencies),
  TE.getOrElse(shouldNotBeCalled),
)();

describe('decide-whether-to-redirect-or-display-a-page', () => {
  const expressionDoi = arbitraryExpressionDoi();
  let framework: TestFramework;
  let result: ConstructPageResult;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the expressionDoi is the latest for the paper', () => {
    beforeEach(async () => {
      const dependencies = {
        ...framework.dependenciesForViews,
        fetchPublishingHistory: () => TE.right(
          arbitraryPublishingHistoryOnlyPreprints({ latestExpressionDoi: expressionDoi }),
        ),
      };
      result = await getDecision(expressionDoi, dependencies);
    });

    it('displays the page', () => {
      expect(result.tag).toBe('html-page');
    });
  });

  describe('when the expressionDoi is not the latest for the paper', () => {
    beforeEach(async () => {
      const dependencies = {
        ...framework.dependenciesForViews,
        fetchPublishingHistory: () => TE.right(
          arbitraryPublishingHistoryOnlyPreprints({ earliestExpressionDoi: expressionDoi }),
        ),
      };
      result = await getDecision(expressionDoi, dependencies);
    });

    it('redirects', () => {
      expect(result.tag).toBe('redirect-target');
    });
  });
});
