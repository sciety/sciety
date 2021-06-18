import dotenv from 'dotenv';
import {
  $, goto, openBrowser, text, within,
} from 'taiko';
import { screenshotTeardown } from './utilities';

describe('legacy redirects', () => {
  beforeEach(async () => {
    dotenv.config();
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('search on articles', () => {
    it('redirects to the search page', async () => {
      await goto('localhost:8080/articles?query=covid');
      const result = await $('.search-form').exists();

      expect(result).toBe(true);
    });
  });

  describe('user page', () => {
    it('redirects to the saved-articles tab', async () => {
      await goto('localhost:8080/users/1295307136415735808');
      const isSavedArticlesTab = await text('Saved articles', within($('h3.user-page-tab--heading'))).exists();

      expect(isSavedArticlesTab).toBe(true);
    });
  });
});
