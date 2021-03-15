import { pipe } from 'fp-ts/function';
import { RenderSearchResult } from '../../src/search-results-page/render-search-result';
import { renderSearchResults } from '../../src/search-results-page/render-search-results';
import { Doi } from '../../src/types/doi';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { shouldNotBeCalled } from '../should-not-be-called';

describe('render-search-results component', () => {
  describe('when there are results', () => {
    it('displays the number of results and a list', async () => {
      const renderSearchResult: RenderSearchResult = () => toHtmlFragment('');
      const rendered = pipe(
        {
          query: 'something',
          availableMatches: 5,
          itemsToDisplay: [
            {
              _tag: 'Article',
              doi: new Doi('10.1101/833392'),
              title: 'the title',
              authors: '1, 2, 3',
              postedDate: new Date('2017-11-30'),
              reviewCount: 0,
            },
          ],
        },
        renderSearchResults(renderSearchResult),
      );

      expect(rendered).toStrictEqual(expect.stringContaining('5 results'));
      expect(rendered).toStrictEqual(expect.stringContaining('<ul'));
    });
  });

  describe('when there are no results', () => {
    it('doesn\'t display any list', async () => {
      const renderSearchResult = shouldNotBeCalled;
      const rendered = pipe(
        {
          query: 'something',
          availableMatches: 0,
          itemsToDisplay: [],
        },
        renderSearchResults(renderSearchResult),
      );

      expect(rendered).toStrictEqual(expect.stringContaining('0 results'));
      expect(rendered).toStrictEqual(expect.not.stringContaining('<ul'));
    });
  });
});
