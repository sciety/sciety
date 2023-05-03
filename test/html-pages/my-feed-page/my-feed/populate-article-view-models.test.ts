import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { populateArticleViewModelsSkippingFailures } from '../../../../src/html-pages/my-feed-page/my-feed/populate-article-view-models';
import { ArticleActivity } from '../../../../src/types/article-activity';
import * as DE from '../../../../src/types/data-error';
import { Doi, eqDoi } from '../../../../src/types/doi';
import { toHtmlFragment } from '../../../../src/types/html-fragment';
import { sanitise } from '../../../../src/types/sanitised-html-fragment';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryDoi } from '../../../types/doi.helper';

describe('populate-article-view-models', () => {
  describe('no failures', () => {
    it('returns article view models by adding article metadata and version dates', async () => {
      const activities: ReadonlyArray<ArticleActivity> = [
        {
          articleId: new Doi('10.1101/11111'),
          evaluationCount: 1,
          latestActivityAt: O.some(new Date()),
          listMembershipCount: 0,
        },
        {
          articleId: arbitraryArticleId(),
          evaluationCount: 1,
          latestActivityAt: O.some(new Date()),
          listMembershipCount: 0,
        },
      ];
      const fetchArticleDetails = (articleId: Doi) => TE.right({
        title: sanitise(toHtmlFragment('')),
        authors: O.none,
        // eslint-disable-next-line jest/no-if
        latestVersionDate: eqDoi.equals(articleId, new Doi('10.1101/11111'))
          ? O.some(new Date('2021-01-01'))
          : O.some(new Date('1921-01-01')),
      });
      const results = await populateArticleViewModelsSkippingFailures(fetchArticleDetails)(activities)();

      expect(results).toHaveLength(2);
      expect(results[0]).toStrictEqual(expect.objectContaining({ latestVersionDate: O.some(new Date('2021-01-01')) }));
      expect(results[1]).toStrictEqual(expect.objectContaining({ latestVersionDate: O.some(new Date('1921-01-01')) }));
    });
  });

  describe('version date failing', () => {
    it('returns an article view model without a version date', async () => {
      const activities: ReadonlyArray<ArticleActivity> = [
        {
          articleId: arbitraryArticleId(),
          evaluationCount: 1,
          latestActivityAt: O.some(new Date()),
          listMembershipCount: 0,
        },
      ];
      const fetchArticleDetails = () => TE.right({
        title: sanitise(toHtmlFragment('')),
        authors: O.none,
        latestVersionDate: O.none,
      });
      const results = await populateArticleViewModelsSkippingFailures(fetchArticleDetails)(activities)();

      expect(results).toStrictEqual([
        expect.objectContaining({
          latestVersionDate: O.none,
        }),
      ]);
    });
  });

  describe('only one of two articles failing, on article title and authors', () => {
    const successDoi = arbitraryDoi();
    const failingDoi = arbitraryDoi();
    const activities: ReadonlyArray<ArticleActivity> = [
      {
        articleId: successDoi,
        evaluationCount: 1,
        latestActivityAt: O.some(new Date()),
        listMembershipCount: 0,
      },
      {
        articleId: failingDoi,
        evaluationCount: 1,
        latestActivityAt: O.some(new Date()),
        listMembershipCount: 0,
      },
    ];
    const fetchArticleDetails = (articleId: Doi) => (eqDoi.equals(articleId, successDoi)
      ? TE.right({
        title: sanitise(toHtmlFragment('')),
        authors: O.none,
        latestVersionDate: O.none,
      })
      : TE.left(DE.notFound));

    it('only returns view models for the not failing articles', async () => {
      const results = await populateArticleViewModelsSkippingFailures(fetchArticleDetails)(activities)();

      expect(results).toHaveLength(1);
      expect(results[0]).toStrictEqual(expect.objectContaining({ articleId: successDoi }));
    });

    it('does not return an article view model for the failing article', async () => {
      const results = await populateArticleViewModelsSkippingFailures(fetchArticleDetails)(activities)();

      expect(results).toHaveLength(1);
      expect(results[0]).not.toStrictEqual(expect.objectContaining({ articleId: failingDoi }));
    });
  });
});
