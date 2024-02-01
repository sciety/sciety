import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { decideWhetherToRedirectOrDisplayAPage } from '../../../src/html-pages/paper-activity-page/decide-whether-to-redirect-or-display-a-page';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { TestFramework, createTestFramework } from '../../framework';
import { ConstructPageResult } from '../../../src/html-pages/construct-page';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryPublishingHistoryOnlyPreprints } from '../../types/publishing-history.helper';

describe('decide-whether-to-redirect-or-display-a-page', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the expressionDoi is the latest for the paper', () => {
    const expressionDoi = arbitraryExpressionDoi();
    let result: ConstructPageResult;

    beforeEach(async () => {
      const dependencies = {
        ...framework.dependenciesForViews,
        fetchPublishingHistory: () => TE.right(
          arbitraryPublishingHistoryOnlyPreprints({ latestExpressionDoi: expressionDoi }),
        ),
      };
      result = await pipe(
        {
          user: O.none,
          expressionDoi,
        },
        decideWhetherToRedirectOrDisplayAPage(dependencies),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('displays the page', () => {
      expect(result.tag).toBe('html-page');
    });
  });

  describe('when the expressionDoi is not the latest for the paper', () => {
    it.todo('redirects');
  });
});
