import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../../../../src/types/html-fragment';
import { sanitise } from '../../../../src/types/sanitised-html-fragment';
import { arbitraryString, arbitraryWord } from '../../../helpers';
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
});
