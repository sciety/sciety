import * as O from 'fp-ts/Option';
import { renderSaveArticle } from '../../src/article-page/render-save-article';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('render-save-article', () => {
  describe('not logged in', () => {
    it('renders save-to-your-list-form', () => {
      const rendered = renderSaveArticle(arbitraryArticleId(), O.none, false);

      expect(rendered).toContain('Save to my list');
    });
  });

  describe('logged in and article is saved', () => {
    it('renders is-saved-link', async () => {
      const rendered = renderSaveArticle(arbitraryArticleId(), O.some(arbitraryUserId()), true);

      expect(rendered).toContain('Saved to my list');
    });
  });

  describe('logged in and article is not saved', () => {
    it('renders save-to-your-list-form', () => {
      const rendered = renderSaveArticle(arbitraryArticleId(), O.some(arbitraryUserId()), false);

      expect(rendered).toContain('Save to my list');
    });
  });
});
