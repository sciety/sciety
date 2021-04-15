import * as O from 'fp-ts/Option';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { fetchArticleDetails } from '../../src/group-page/fetch-article-details';
import { Doi } from '../../src/types/doi';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';

const titleText = 'Accuracy of predicting chemical body composition of growing pigs using dual-energy X-ray absorptiometry';

const getArticle = () => TO.some({
  title: sanitise(toHtmlFragment(titleText)),
  server: 'biorxiv' as const,
  authors: ['Kasper C', 'Schlegel P', 'Ruiz-Ascacibar I', 'Stoll P', 'Bee G'],
});

describe('fetch-article-details', () => {
  describe('latest version date', () => {
    it('returns the latest version date for a doi', async () => {
      const doi = new Doi('10.1101/2020.09.15.286153');
      const latestDate = new Date('2020-12-14');
      const latestVersionDate = pipe(
        await fetchArticleDetails(() => TO.some(latestDate), getArticle)(doi)(),
        O.map((article) => article.latestVersionDate),
      );
      const expected = O.some(latestDate);

      expect(latestVersionDate).toStrictEqual(expected);
    });
  });

  describe('title', () => {
    it('returns the title for a doi', async () => {
      const doi = new Doi('10.1101/2020.09.15.286153');
      const title = pipe(
        await fetchArticleDetails(() => TO.some(new Date()), getArticle)(doi)(),
        O.map((article) => article.title),
      );
      const expected = pipe(
        titleText,
        toHtmlFragment,
        sanitise,
        O.some,
      );

      expect(title).toStrictEqual(expected);
    });
  });

  describe('authors', () => {
    it('returns the authors for a doi', async () => {
      const doi = new Doi('10.1101/2020.09.15.286153');
      const authors = pipe(
        await fetchArticleDetails(() => TO.some(new Date()), getArticle)(doi)(),
        O.map((article) => article.authors),
      );
      const expected = pipe(
        ['Kasper C', 'Schlegel P', 'Ruiz-Ascacibar I', 'Stoll P', 'Bee G'],
        O.some,
      );

      expect(authors).toStrictEqual(expected);
    });
  });
});
