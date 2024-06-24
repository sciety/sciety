import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { constructRelatedArticles } from '../../../../../src/read-side/html-pages/paper-activity-page/construct-view-model/construct-related-articles';
import { ArticleCardViewModel } from '../../../../../src/read-side/html-pages/shared-components/article-card';
import * as DE from '../../../../../src/types/data-error';
import { TestFramework, createTestFramework } from '../../../../framework';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { arbitraryPublishingHistoryOnlyPreprints } from '../../../../types/publishing-history.helper';

describe('construct-related-articles', () => {
  let framework: TestFramework;
  let relatedArticles: ReadonlyArray<ArticleCardViewModel>;

  describe('given there are more than 3 possible related articles', () => {
    beforeEach(async () => {
      framework = createTestFramework();
      relatedArticles = await pipe(
        constructRelatedArticles(arbitraryPublishingHistoryOnlyPreprints(), framework.dependenciesForViews),
        TO.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns 3 items', () => {
      expect(relatedArticles).toHaveLength(3);
    });
  });

  describe('given there are 0 related articles', () => {
    let result: O.Option<ReadonlyArray<ArticleCardViewModel>>;

    beforeEach(async () => {
      framework = createTestFramework();
      framework.dependenciesForViews.fetchRecommendedPapers = () => TE.right([]);
      result = await constructRelatedArticles(
        arbitraryPublishingHistoryOnlyPreprints(),
        framework.dependenciesForViews,
      )();
    });

    it('the related articles section is not shown', () => {
      expect(O.isNone(result)).toBe(true);
    });
  });

  describe('when the query fails', () => {
    let result: O.Option<ReadonlyArray<ArticleCardViewModel>>;

    beforeEach(async () => {
      framework = createTestFramework();
      framework.dependenciesForViews.fetchRecommendedPapers = () => TE.left(DE.unavailable);
      result = await constructRelatedArticles(
        arbitraryPublishingHistoryOnlyPreprints(),
        framework.dependenciesForViews,
      )();
    });

    it('the related articles section is not shown', () => {
      expect(O.isNone(result)).toBe(true);
    });
  });
});
