import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { selectSubsetToDisplay } from '../../src/search-results-page/select-subset-to-display';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';
import {
  arbitraryDate, arbitraryNumber, arbitraryString, arbitraryWord,
} from '../helpers';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';

const arbitraryArticleItem = () => ({
  _tag: 'Article' as const,
  doi: arbitraryDoi(),
  server: 'biorxiv' as const,
  title: pipe(arbitraryString(), toHtmlFragment, sanitise),
  authors: [arbitraryString()],
  postedDate: arbitraryDate(),
});

const arbitraryGroupItem = () => ({
  _tag: 'Group' as const,
  id: arbitraryGroupId(),
});

describe('select-subset-to-display', () => {
  describe('given the category of "articles"', () => {
    it('returns only articles when given articles and groups', () => {
      const articleItem = arbitraryArticleItem();
      const state = {
        query: '',
        pageSize: 2,
        pageNumber: O.none,
        category: 'articles',
        groups: [arbitraryGroupItem()],
        articles: {
          items: [articleItem],
          total: 1,
          nextCursor: O.some(arbitraryWord()),
        },
      };
      const result = selectSubsetToDisplay(state);

      expect(result.itemsToDisplay).toStrictEqual([articleItem]);
    });
  });

  describe('given the category of "groups"', () => {
    it('returns only groups when given articles and groups', () => {
      const groupItem = arbitraryGroupItem();
      const state = {
        query: '',
        pageSize: 2,
        pageNumber: O.none,
        category: 'groups',
        groups: [groupItem],
        articles: {
          items: [arbitraryArticleItem()],
          total: 1,
          nextCursor: O.some(arbitraryWord()),
        },
      };
      const result = selectSubsetToDisplay(state);

      expect(result.itemsToDisplay).toStrictEqual([groupItem]);
    });

    it('nextCursor should be none', () => {
      const state = {
        query: '',
        pageSize: 2,
        pageNumber: O.none,
        category: 'groups',
        groups: [arbitraryGroupItem()],
        articles: {
          items: [],
          total: 0,
          nextCursor: O.some(arbitraryWord()),
        },
      };
      const result = selectSubsetToDisplay(state);

      expect(result.nextCursor).toStrictEqual(O.none);
    });
  });

  it('returns the correct numbers of available matches for each category', () => {
    const numberOfMatchingArticles = arbitraryNumber(2, 1000);
    const state = {
      query: '',
      pageSize: 2,
      pageNumber: O.none,
      category: 'articles',
      groups: [arbitraryGroupItem()],
      articles: {
        items: [arbitraryArticleItem()],
        total: numberOfMatchingArticles,
        nextCursor: O.some(arbitraryWord()),
      },
    };
    const result = selectSubsetToDisplay(state);

    expect(result.availableGroupMatches).toStrictEqual(1);
    expect(result.availableArticleMatches).toStrictEqual(numberOfMatchingArticles);
  });
});
