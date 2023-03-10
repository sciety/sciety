import * as O from 'fp-ts/Option';
import { renderSaveArticle } from '../../../../src/html-pages/article-page/render-as-html/render-save-article';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryListId } from '../../../types/list-id.helper';
import { arbitraryUserId } from '../../../types/user-id.helper';

describe('render-save-article', () => {
  describe('not logged in', () => {
    it('renders log in call to action', () => {
      const rendered = renderSaveArticle({
        doi: arbitraryArticleId(),
        isArticleInList: O.none,
        userListManagement: O.none,
      });

      expect(rendered).toContain('Log in to save this article');
    });
  });

  describe('logged in and article is saved', () => {
    it('renders is-saved-link', async () => {
      const rendered = renderSaveArticle({
        doi: arbitraryArticleId(),
        isArticleInList: O.some(arbitraryListId()),
        userListManagement: O.some({ id: arbitraryUserId(), listName: 'My list name' }),
      });

      expect(rendered).toContain('Saved to my list');
    });
  });

  describe('logged in and article is not saved', () => {
    it('renders save-to-your-list-form', () => {
      const rendered = renderSaveArticle({
        doi: arbitraryArticleId(),
        isArticleInList: O.none,
        userListManagement: O.some({ id: arbitraryUserId(), listName: 'My list name' }),
      });

      expect(rendered).toContain('Save article');
    });
  });
});
