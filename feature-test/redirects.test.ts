import dotenv from 'dotenv';
import {
  $, closeBrowser, goto, openBrowser, screenshot,
} from 'taiko';

describe('legacy redirects', () => {
  beforeEach(async () => {
    dotenv.config();
    await openBrowser();
  });

  afterEach(async () => {
    await screenshot({ path: `./feature-test/screenshots/${expect.getState().currentTestName}.png` });
    await closeBrowser();
  });

  describe('search on articles', () => {
    it('redirects to the search page', async () => {
      await goto('localhost:8080/articles?query=covid');
      const result = await $('.search-form').exists();

      expect(result).toBe(true);
    });
  });
});
