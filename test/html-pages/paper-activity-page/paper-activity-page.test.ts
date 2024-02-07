import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { TestFramework, createTestFramework } from '../../framework';
import { ConstructPageResult } from '../../../src/html-pages/construct-page';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryPublishingHistoryOnlyPreprints } from '../../types/publishing-history.helper';
import { Dependencies } from '../../../src/html-pages/paper-activity-page/construct-view-model/dependencies';
import { paperActivityPage } from '../../../src/html-pages/paper-activity-page/paper-activity-page';
import * as EDOI from '../../../src/types/expression-doi';

const getDecision = async (inputExpressionDoi: string, dependencies: Dependencies) => pipe(
  {
    expressionDoi: inputExpressionDoi,
  },
  paperActivityPage(dependencies),
  TE.getOrElse(shouldNotBeCalled),
)();

describe('paper-activity-page', () => {
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

    it('redirects to the paper activity page for the latest expression doi', () => {
      expect(result.tag).toBe('redirect-target');
    });
  });

  describe('when the expressionDoi is not expressed in its canonical form', () => {
    const expressionDoiContainingLetters = EDOI.fromValidatedString('10.1234/scielopreprints.567');

    beforeEach(async () => {
      const dependencies = {
        ...framework.dependenciesForViews,
        fetchPublishingHistory: () => TE.right(
          arbitraryPublishingHistoryOnlyPreprints({ latestExpressionDoi: expressionDoiContainingLetters }),
        ),
      };
      result = await getDecision(expressionDoiContainingLetters.toUpperCase(), dependencies);
    });

    it('redirects to the paper activity page for the canonical doi', () => {
      expect(result.tag).toBe('redirect-target');
    });
  });
});
