import * as O from 'fp-ts/Option';
import { toHtmlFragment } from '../../../src/types/html-fragment';
import { renderSavedArticles } from '../../../src/user-page/saved-articles/render-saved-articles';
import { arbitraryString } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';

describe('render-saved-articles', () => {
  describe('when there are saved articles', () => {
    it('renders an HTML ordered list', async () => {
      const savedArticles = [
        {
          doi: arbitraryDoi(),
          title: O.some(toHtmlFragment(arbitraryString())),
        },
      ];
      const rendered = renderSavedArticles(savedArticles);

      expect(rendered).toContain('<ol');
    });
  });

  describe('when there are no saved articles', () => {
    it('renders nothing', async () => {
      const rendered = renderSavedArticles([]);

      expect(rendered).toHaveLength(0);
    });
  });
});
