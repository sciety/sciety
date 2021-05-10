import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderSearchResults } from '../../src/search-results-page/render-search-results';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';
import { arbitraryDoi } from '../types/doi.helper';

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
              doi: arbitraryDoi(),
              title: pipe('the title', toHtmlFragment, sanitise),
              authors: ['1', '2', '3'],
              latestVersionDate: O.none,
              latestActivityDate: O.none,
              evaluationCount: 0,
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
