import * as T from 'fp-ts/lib/Task';
import { RenderSearchResult } from '../../src/article-search-page/render-search-result';
import createRenderSearchResults, { FindArticles } from '../../src/article-search-page/render-search-results';
import Doi from '../../src/types/doi';
import { toHtmlFragment } from '../../src/types/html-fragment';
import shouldNotBeCalled from '../should-not-be-called';

describe('render-search-results component', (): void => {
  describe('when there are results', (): void => {
    it('displays the number of results and a list', async (): Promise<void> => {
      const findArticles: FindArticles = () => T.of(
        {
          total: 5,
          items: [
            {
              doi: new Doi('10.1101/833392'),
              title: 'the title',
              authors: '1, 2, 3',
              postedDate: new Date('2017-11-30'),
            },
          ],
        },
      );
      const renderSearchResult: RenderSearchResult = () => T.of(toHtmlFragment(''));
      const rendered = await createRenderSearchResults(findArticles, renderSearchResult)('10.1101/833392');

      expect(rendered).toStrictEqual(expect.stringContaining('5 results'));
      expect(rendered).toStrictEqual(expect.stringContaining('<ul'));
    });
  });

  describe('when there are no results', (): void => {
    it('doesn\'t display any list', async (): Promise<void> => {
      const findArticles: FindArticles = () => T.of(
        {
          total: 0,
          items: [],
        },
      );
      const renderSearchResult = shouldNotBeCalled;
      const rendered = await createRenderSearchResults(findArticles, renderSearchResult)('10.1101/833392');

      expect(rendered).toStrictEqual(expect.stringContaining('0 results'));
      expect(rendered).toStrictEqual(expect.not.stringContaining('<ul'));
    });
  });
});
