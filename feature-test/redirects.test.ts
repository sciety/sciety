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
    it('redirects to the list tab', async () => {
      await goto('localhost:8080/users/scietyHQ');
      const isSavedArticlesTab = await text('Lists', within($('.tab--active'))).exists();

      expect(isSavedArticlesTab).toBe(true);
    });
  });

  describe('user list page', () => {
    describe('when the user ID is not found', () => {
      it.skip('displays a formatted error page', async () => {
        // Taiko doesn't seem to be able to load 404 pages with this call
        await goto('localhost:8080/users/432143214321/lists/saved-articles');

        const hasErrorHeading = await text('Oops!', within($('.error-page'))).exists();

        expect(hasErrorHeading).toBe(true);
      });
    });
  });
});
