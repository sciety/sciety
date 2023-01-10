import {
  $, currentURL, goto, openBrowser,
} from 'taiko';
import { screenshotTeardown } from './utilities';

describe('legacy redirects', () => {
  beforeEach(async () => {
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

  describe('the legacy user list page', () => {
    it.failing('redirects to the generic user list page', async () => {
      await goto('localhost:8080/users/BlueReZZ/lists/saved-articles');
      const result = await currentURL();

      expect(result).toContain('/lists/f64c15a3-b125-4d86-8de8-9fd21dd7dd7c');
    });
  });
});
