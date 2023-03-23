import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../../../../src/types/html-fragment';
import { sanitise } from '../../../../src/types/sanitised-html-fragment';
import { arbitraryNumber, arbitraryString, arbitraryWord } from '../../../helpers';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { selectSubsetToDisplay } from '../../../../src/html-pages/search-results-page/construct-view-model/select-subset-to-display';

const arbitraryArticleItem = () => ({
  _tag: 'Article' as const,
  articleId: arbitraryArticleId(),
  server: 'biorxiv' as const,
  title: pipe(arbitraryString(), toHtmlFragment, sanitise),
  authors: O.some([arbitraryString()]),
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
        evaluatedOnly: false,
        pageSize: 2,
        pageNumber: O.none,
        category: 'articles' as const,
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
        evaluatedOnly: false,
        pageSize: 2,
        pageNumber: O.none,
        category: 'groups' as const,
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
        evaluatedOnly: false,
        pageSize: 2,
        pageNumber: O.none,
        category: 'groups' as const,
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
      evaluatedOnly: false,
      pageSize: 2,
      pageNumber: O.none,
      category: 'articles' as const,
      groups: [arbitraryGroupItem()],
      articles: {
        items: [arbitraryArticleItem()],
        total: numberOfMatchingArticles,
        nextCursor: O.some(arbitraryWord()),
      },
    };
    const result = selectSubsetToDisplay(state);

    expect(result.availableGroupMatches).toBe(1);
    expect(result.availableArticleMatches).toStrictEqual(numberOfMatchingArticles);
  });
});
