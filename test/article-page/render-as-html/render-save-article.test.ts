import * as O from 'fp-ts/Option';
import { renderSaveArticle } from '../../../src/article-page/render-as-html/render-save-article';
import { arbitraryUri } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('render-save-article', () => {
  describe('not logged in', () => {
    it('renders save-to-your-list-form', () => {
      const rendered = renderSaveArticle({
        doi: arbitraryArticleId(),
        userId: O.none,
        hasUserSavedArticle: false,
        userListUrl: O.none,
      });

      expect(rendered).toContain('Save to my list');
    });
  });

  describe('logged in and article is saved', () => {
    it('renders is-saved-link', async () => {
      const rendered = renderSaveArticle({
        doi: arbitraryArticleId(),
        userId: O.some(arbitraryUserId()),
        hasUserSavedArticle: true,
        userListUrl: O.some(arbitraryUri()),
      });

      expect(rendered).toContain('Saved to my list');
    });
  });

  describe('logged in and article is not saved', () => {
    it('renders save-to-your-list-form', () => {
      const rendered = renderSaveArticle({
        doi: arbitraryArticleId(),
        userId: O.some(arbitraryUserId()),
        hasUserSavedArticle: false,
        userListUrl: O.none,
      });

      expect(rendered).toContain('Save to my list');
    });
  });
});
