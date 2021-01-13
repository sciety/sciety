import * as O from 'fp-ts/lib/Option';
import Doi from '../../src/types/doi';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { renderSavedArticles, SavedArticle } from '../../src/user-page/render-saved-articles';

describe('render-saved-articles', () => {
  describe('when there are saved articles', () => {
    it('renders an HTML ordered list', async () => {
      const savedArticles: ReadonlyArray<SavedArticle> = [
        {
          doi: new Doi('10.1101/2020.07.04.187583'),
          title: O.some(toHtmlFragment('Some title')),
        },
      ];
      const rendered = renderSavedArticles(savedArticles);

      expect(rendered).toContain('<ol');
    });
  });

  describe('when there are no saved articles', () => {
    it('renders nothing', async () => {
      const savedArticles: ReadonlyArray<SavedArticle> = [];
      const rendered = renderSavedArticles(savedArticles);

      expect(rendered).toHaveLength(0);
    });
  });
});
