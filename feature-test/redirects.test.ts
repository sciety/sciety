import {
  $, goto, openBrowser,
} from 'taiko';
import { screenshotTeardown } from './utilities.js';

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
});
