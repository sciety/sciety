import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { selectSubsetToDisplay } from '../../src/search-results-page/select-subset-to-display';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';
import { arbitraryDate, arbitraryString } from '../helpers';
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
  describe('given no category', () => {
    describe('prioritizes groups over articles', () => {
      it('returns 2 groups and 0 articles when given a limit of 2, and 2 of each', () => {
        const groupItem1 = arbitraryGroupItem();
        const groupItem2 = arbitraryGroupItem();
        const state = {
          query: '',
          category: O.none,
          groups: [groupItem1, groupItem2],
          articles: {
            items: [arbitraryArticleItem(), arbitraryArticleItem()],
            total: 2,
          },
        };
        const result = selectSubsetToDisplay(2)(state);

        expect(result.itemsToDisplay).toStrictEqual([groupItem1, groupItem2]);
      });
    });

    describe('length limit', () => { });

    describe('total calculation', () => { });

    describe('maintaining order of results', () => { });
  });

  describe('given the category of "articles"', () => {
    it('returns only articles when given articles and groups', () => {
      const articleItem = arbitraryArticleItem();
      const state = {
        query: '',
        category: O.some('articles'),
        groups: [arbitraryGroupItem()],
        articles: {
          items: [articleItem],
          total: 1,
        },
      };
      const result = selectSubsetToDisplay(2)(state);

      expect(result.itemsToDisplay).toStrictEqual([articleItem]);
    });

    it.todo('shows the correct count of matches');
  });

  describe('given the category of "groups"', () => {
    it('returns only groups when given articles and groups', () => {
      const groupItem = arbitraryGroupItem();
      const state = {
        query: '',
        category: O.some('groups'),
        groups: [groupItem],
        articles: {
          items: [arbitraryArticleItem()],
          total: 1,
        },
      };
      const result = selectSubsetToDisplay(2)(state);

      expect(result.itemsToDisplay).toStrictEqual([groupItem]);
    });

    it.todo('shows the correct count of matches');
  });
});
