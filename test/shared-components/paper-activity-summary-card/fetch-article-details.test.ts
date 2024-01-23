import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as PES from '../../../src/types/paper-expressions';
import { fetchArticleDetails } from '../../../src/shared-components/paper-activity-summary-card/fetch-article-details';
import * as DE from '../../../src/types/data-error';
import { toHtmlFragment } from '../../../src/types/html-fragment';
import { sanitise } from '../../../src/types/sanitised-html-fragment';
import { arbitraryArticleDetails } from '../../third-parties/external-queries.helper';
import { TestFramework, createTestFramework } from '../../framework';
import { arbitraryUri } from '../../helpers';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitraryArticleServer } from '../../types/article-server.helper';

const titleText = 'Accuracy of predicting chemical body composition of growing pigs using dual-energy X-ray absorptiometry';

const getArticle = () => TE.right({
  ...arbitraryArticleDetails(),
  title: sanitise(toHtmlFragment(titleText)),
  server: 'biorxiv' as const,
  authors: O.some(['Kasper C', 'Schlegel P', 'Ruiz-Ascacibar I', 'Stoll P', 'Bee G']),
});

describe('fetch-article-details', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('latest version date', () => {
    it('returns the latest version date for an article', async () => {
      const expressionDoi = arbitraryExpressionDoi();
      const latestDate = new Date('2020-12-14');
      const articleDetails = await pipe(
        expressionDoi,
        fetchArticleDetails({
          ...framework.dependenciesForViews,
          findAllExpressionsOfPaper: () => pipe(
            [
              {
                expressionType: 'preprint',
                expressionDoi,
                publisherHtmlUrl: new URL(arbitraryUri()),
                publishedAt: latestDate,
                server: O.some(arbitraryArticleServer()),
              },
            ],
            PES.fromExpressions,
            TE.right,
          ),
        }),
      )();

      expect(articleDetails).toStrictEqual(
        E.right(
          expect.objectContaining({
            latestVersionDate: O.some(latestDate),
          }),
        ),
      );
    });

    it('returns an O.none for the latest version date when it fails', async () => {
      const articleDetails = await pipe(
        arbitraryExpressionDoi(),
        fetchArticleDetails({
          ...framework.dependenciesForViews,
          findAllExpressionsOfPaper: () => TE.left(DE.notFound),
        }),
      )();

      expect(articleDetails).toStrictEqual(
        E.right(
          expect.objectContaining({
            latestVersionDate: O.none,
          }),
        ),
      );
    });
  });

  describe('getArticle', () => {
    it('returns on the left when getArticle fails', async () => {
      const articleDetails = await fetchArticleDetails(
        {
          ...framework.dependenciesForViews,
          fetchExpressionFrontMatter: () => TE.left(DE.unavailable),
        },
      )(arbitraryExpressionDoi())();

      expect(articleDetails).toStrictEqual(E.left(DE.unavailable));
    });

    describe('title', () => {
      it('returns the title for an article', async () => {
        const expressionDoi = arbitraryExpressionDoi();
        const title = await pipe(
          expressionDoi,
          fetchArticleDetails(
            {
              ...framework.dependenciesForViews,
              fetchExpressionFrontMatter: getArticle,
            },
          ),
          TE.map((article) => article.title),
        )();
        const expected = pipe(
          titleText,
          toHtmlFragment,
          sanitise,
          E.right,
        );

        expect(title).toStrictEqual(expected);
      });
    });

    describe('authors', () => {
      it('returns the authors for an article', async () => {
        const expressionDoi = arbitraryExpressionDoi();
        const authors = await pipe(
          expressionDoi,
          fetchArticleDetails(
            {
              ...framework.dependenciesForViews,
              fetchExpressionFrontMatter: getArticle,
            },
          ),
          TE.map((article) => article.authors),
        )();
        const expected = pipe(
          O.some(['Kasper C', 'Schlegel P', 'Ruiz-Ascacibar I', 'Stoll P', 'Bee G']),
          E.right,
        );

        expect(authors).toStrictEqual(expected);
      });
    });
  });
});
