import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderSearchResults } from '../../src/search-results-page/render-search-results';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';
import { arbitraryDoi } from '../types/doi.helper';

const arbitraryArticleViewModel = {
  _tag: 'Article',
  doi: arbitraryDoi(),
  title: pipe('the title', toHtmlFragment, sanitise),
  authors: ['1', '2', '3'],
  latestVersionDate: O.none,
  latestActivityDate: O.none,
  evaluationCount: 0,
};

describe('render-search-results component', () => {
  describe('when there are results', () => {
    it('displays the number of results and a list', async () => {
      const availableArticleMatches = 3;
      const availableGroupMatches = 2;
      const rendered = pipe(
        {
          query: 'something',
          availableMatches: 5,
          availableArticleMatches,
          availableGroupMatches,
          itemsToDisplay: [
            arbitraryArticleViewModel,
          ],
        },
        renderSearchResults,
      );

      expect(rendered).toStrictEqual(expect.stringContaining(`Articles (${availableArticleMatches})`));
      expect(rendered).toStrictEqual(expect.stringContaining(`Groups (${availableGroupMatches})`));
    });
  });

  describe('when there are no results', () => {
    it.skip('doesn\'t display any list', async () => {
      const rendered = pipe(
        {
          query: 'something',
          availableMatches: 0,
          availableArticleMatches: 0,
          availableGroupMatches: 0,
          itemsToDisplay: [],
        },
        renderSearchResults,
      );

      expect(rendered).toStrictEqual(expect.stringContaining('0 results'));
    });
  });
});
