import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { TestFramework, createTestFramework } from '../../framework';
import { ConstructPageResult } from '../../../src/html-pages/construct-page';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryPublishingHistoryOnlyPreprints } from '../../types/publishing-history.helper';
import { Dependencies } from '../../../src/html-pages/paper-activity-page/construct-view-model/dependencies';
import { paperActivityPage } from '../../../src/html-pages/paper-activity-page/paper-activity-page';
import * as EDOI from '../../../src/types/expression-doi';
import { paperActivityPagePath } from '../../../src/standards';
import { toRedirectTarget } from '../../../src/html-pages/redirect-target';

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
    const latestExpressionDoi = arbitraryExpressionDoi();
    let output: unknown;

    beforeEach(async () => {
      const dependencies = {
        ...framework.dependenciesForViews,
        fetchPublishingHistory: () => TE.right(
          arbitraryPublishingHistoryOnlyPreprints({ earliestExpressionDoi: expressionDoi, latestExpressionDoi }),
        ),
      };
      output = await pipe(
        {
          expressionDoi,
        },
        paperActivityPage(dependencies),
      )();
    });

    it('redirects to the paper activity page for the latest expression doi', () => {
      expect(output).toStrictEqual(E.left(toRedirectTarget(
        paperActivityPagePath(latestExpressionDoi),
      )));
    });
  });

  describe('when the expressionDoi is not expressed in its canonical form', () => {
    const expressionDoiContainingLetters = EDOI.fromValidatedString('10.1234/scielopreprints.567');
    let output: unknown;

    beforeEach(async () => {
      const dependencies = {
        ...framework.dependenciesForViews,
        fetchPublishingHistory: () => TE.right(
          arbitraryPublishingHistoryOnlyPreprints({ latestExpressionDoi: expressionDoiContainingLetters }),
        ),
      };
      output = await pipe(
        {
          expressionDoi: expressionDoiContainingLetters.toUpperCase(),
        },
        paperActivityPage(dependencies),
      )();
    });

    it('redirects to the paper activity page for the canonical doi', () => {
      expect(output).toStrictEqual(E.left(toRedirectTarget(
        paperActivityPagePath(expressionDoiContainingLetters),
      )));
    });
  });
});
