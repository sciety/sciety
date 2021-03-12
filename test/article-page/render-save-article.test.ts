import * as O from 'fp-ts/Option';
import { renderSaveArticle } from '../../src/article-page/render-save-article';
import { Doi } from '../../src/types/doi';
import { toUserId } from '../../src/types/user-id';

describe('render-save-article', () => {
  describe('not logged in', () => {
    it('renders save-to-your-list-form', () => {
      const rendered = renderSaveArticle(new Doi('10.1111/foobar'), O.none, false);

      expect(rendered).toContain('Save to my list');
    });
  });

  describe('logged in and article is saved', () => {
    it('renders is-saved-link', async () => {
      const rendered = renderSaveArticle(new Doi('10.1111/foobar'), O.some(toUserId('user')), true);

      expect(rendered).toContain('Saved to my list');
    });
  });

  describe('logged in and article is not saved', () => {
    it('renders save-to-your-list-form', () => {
      const rendered = renderSaveArticle(new Doi('10.1111/foobar'), O.some(toUserId('user')), false);

      expect(rendered).toContain('Save to my list');
    });
  });
});
