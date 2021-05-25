import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { selectSubsetToDisplay } from '../../src/search-results-page/select-subset-to-display';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';

describe('select-subset-to-display', () => {
  describe('given no category', () => {
    describe('prioritizes groups over articles', () => {
      it('returns 2 groups and 0 articles when given a limit of 2, and 2 of each', () => {
        const group1 = {
          _tag: 'Group' as const,
          id: arbitraryGroupId(),
        };
        const group2 = {
          _tag: 'Group' as const,
          id: arbitraryGroupId(),
        };
        const article = {
          _tag: 'Article' as const,
          doi: arbitraryDoi(),
          server: 'biorxiv' as const,
          title: pipe('', toHtmlFragment, sanitise),
          authors: [''],
          postedDate: new Date(),
        };
        const state = {
          query: '',
          category: O.none,
          groups: [group1, group2],
          articles: {
            items: [article, article],
            total: 2,
          },
        };
        const result = selectSubsetToDisplay(2)(state);

        expect(result.itemsToDisplay).toStrictEqual([group1, group2]);
      });
    });

    describe('length limit', () => { });

    describe('total calculation', () => { });

    describe('maintaining order of results', () => { });
  });

  describe('given the category of "articles"', () => {
    it('returns only articles when given articles and groups', () => {
      const group = {
        _tag: 'Group' as const,
        id: arbitraryGroupId(),
      };
      const article = {
        _tag: 'Article' as const,
        doi: arbitraryDoi(),
        server: 'biorxiv' as const,
        title: pipe('', toHtmlFragment, sanitise),
        authors: [''],
        postedDate: new Date(),
      };
      const state = {
        query: '',
        category: O.some('articles'),
        groups: [group],
        articles: {
          items: [article],
          total: 1,
        },
      };
      const result = selectSubsetToDisplay(2)(state);

      expect(result.itemsToDisplay).toStrictEqual([article]);
    });
  });

  describe('given the category of "groups"', () => {
    it.todo('returns only groups when given articles and groups');
  });
});
