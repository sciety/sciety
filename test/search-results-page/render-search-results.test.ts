import * as O from 'fp-ts/Option';
import { JSDOM } from 'jsdom';
import { renderSearchResults } from '../../src/search-results-page/render-search-results';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';
import { arbitraryString, arbitraryWord } from '../helpers';
import { arbitraryDoi } from '../types/doi.helper';

describe('render-search-results', () => {
  describe('when given a nextCursor', () => {
    it('renders a next link', () => {
      const cursor = arbitraryWord();
      const rendered = JSDOM.fragment(renderSearchResults({
        query: arbitraryString(),
        category: 'articles',
        itemsToDisplay: [
          {
            doi: arbitraryDoi(),
            title: sanitise(toHtmlFragment(arbitraryString())),
            authors: [],
            latestVersionDate: O.none,
            latestActivityDate: O.none,
            evaluationCount: 0,
          },
        ],
        availableArticleMatches: 100,
        availableGroupMatches: 0,
        nextCursor: O.some(cursor),
      }));

      const nextLink = rendered.querySelector('.search-results__next_link');

      expect(nextLink?.getAttribute('href')).toContain(`cursor=${cursor}`);
    });
  });

  describe('when not given a nextCursor', () => {
    it.todo('renders no next link');
  });
});
