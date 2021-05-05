import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { populateArticleViewModelsSkippingFailures } from '../../../src/home-page/your-feed/populate-article-view-models';
import { ArticleActivity } from '../../../src/types/article-activity';
import { Doi, eqDoi } from '../../../src/types/doi';
import { toHtmlFragment } from '../../../src/types/html-fragment';
import { sanitise } from '../../../src/types/sanitised-html-fragment';

describe('populate-article-view-models', () => {
  describe('no failures', () => {
    it('returns article view models by adding article metadata and version dates', async () => {
      const getArticle = () => TE.right(
        {
          title: sanitise(toHtmlFragment('')),
          authors: [],
          server: 'biorxiv' as const,
        },
      );
      const findVersionsForArticleDoi = (doi: Doi) => TO.some([
        {
          occurredAt: eqDoi.equals(doi, new Doi('10.1101/11111')) ? new Date('2021-01-01') : new Date('1921-01-01'),
        },
      ] as RNEA.ReadonlyNonEmptyArray<{ occurredAt: Date }>);
      const activities: ReadonlyArray<ArticleActivity> = [
        {
          doi: new Doi('10.1101/11111'),
          evaluationCount: 1,
          latestActivityDate: new Date(),
        },
        {
          doi: new Doi('10.1101/22222'),
          evaluationCount: 1,
          latestActivityDate: new Date(),
        },
      ];
      const results = await populateArticleViewModelsSkippingFailures(
        getArticle,
        findVersionsForArticleDoi,
      )(activities)();

      expect(results).toHaveLength(2);
      expect(results[0]).toStrictEqual(expect.objectContaining({ latestVersionDate: O.some(new Date('2021-01-01')) }));
      expect(results[1]).toStrictEqual(expect.objectContaining({ latestVersionDate: O.some(new Date('1921-01-01')) }));
    });
  });

  describe('version date failing', () => {
    it.todo('returns an article view model without a version date');
  });

  describe('only one of two articles failing, on article title and authors', () => {
    it.todo('only returns view models for the not failing articles');

    it.todo('does not return an article view model for the failing article');
  });

  describe('all articles failing', () => {
    // We're having trouble accessing this content right now. Please try again later.
    it.todo('display error message');
  });
});
