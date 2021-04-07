import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderSearchResults } from '../../src/search-results-page/render-search-results';
import { Doi } from '../../src/types/doi';

describe('render-search-results component', () => {
  describe('when there are results', () => {
    it('displays the number of results and a list', async () => {
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
              latestVersionDate: O.none,
              reviewCount: 0,
            },
          ],
        },
        renderSearchResults,
      );

      expect(rendered).toStrictEqual(expect.stringContaining('5 results'));
      expect(rendered).toStrictEqual(expect.stringContaining('<ul'));
    });
  });

  describe('when there are no results', () => {
    it('doesn\'t display any list', async () => {
      const rendered = pipe(
        {
          query: 'something',
          availableMatches: 0,
          itemsToDisplay: [],
        },
        renderSearchResults,
      );

      expect(rendered).toStrictEqual(expect.stringContaining('0 results'));
      expect(rendered).toStrictEqual(expect.not.stringContaining('<ul'));
    });
  });
});
