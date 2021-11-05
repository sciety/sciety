import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { fetchArticleDetails } from '../../../src/shared-components/article-card/fetch-article-details';
import * as DE from '../../../src/types/data-error';
import { toHtmlFragment } from '../../../src/types/html-fragment';
import { sanitise } from '../../../src/types/sanitised-html-fragment';
import { arbitraryDoi } from '../../types/doi.helper';

const titleText = 'Accuracy of predicting chemical body composition of growing pigs using dual-energy X-ray absorptiometry';

const getArticle = () => TO.some({
  title: sanitise(toHtmlFragment(titleText)),
  server: 'biorxiv' as const,
  authors: ['Kasper C', 'Schlegel P', 'Ruiz-Ascacibar I', 'Stoll P', 'Bee G'],
});

describe('fetch-article-details', () => {
  describe('latest version date', () => {
    it('returns the latest version date for a doi', async () => {
      const doi = arbitraryDoi();
      const latestDate = new Date('2020-12-14');
      const articleDetails = await pipe(
        doi,
        fetchArticleDetails(() => TO.some(latestDate), getArticle),
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
        arbitraryDoi(),
        fetchArticleDetails(() => TO.none, getArticle),
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
    it('returns O.none when getArticle fails', async () => {
      const articleDetails = await fetchArticleDetails(
        () => TO.some(new Date()),
        () => TO.none,
      )(arbitraryDoi())();

      expect(articleDetails).toStrictEqual(E.left(DE.notFound));
    });

    describe('title', () => {
      it('returns the title for a doi', async () => {
        const doi = arbitraryDoi();
        const title = await pipe(
          doi,
          fetchArticleDetails(() => TO.some(new Date()), getArticle),
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
      it('returns the authors for a doi', async () => {
        const doi = arbitraryDoi();
        const authors = await pipe(
          doi,
          fetchArticleDetails(() => TO.some(new Date()), getArticle),
          TE.map((article) => article.authors),
        )();
        const expected = pipe(
          ['Kasper C', 'Schlegel P', 'Ruiz-Ascacibar I', 'Stoll P', 'Bee G'],
          E.right,
        );

        expect(authors).toStrictEqual(expected);
      });
    });
  });
});
