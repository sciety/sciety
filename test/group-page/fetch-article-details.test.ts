import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { fetchArticleDetails } from '../../src/group-page/fetch-article-details';
import { Doi } from '../../src/types/doi';

describe('fetch-article-details', () => {
  describe('latest version date', () => {
    it('returns the latest version date for a doi', async () => {
      const doi = new Doi('10.1101/2020.09.15.286153');
      const latestVersionDate = pipe(
        await fetchArticleDetails(doi)(),
        O.map((article) => article.latestVersionDate),
      );
      const expected = O.some(new Date('2020-12-14'));

      expect(latestVersionDate).toStrictEqual(expected);
    });
  });
});
