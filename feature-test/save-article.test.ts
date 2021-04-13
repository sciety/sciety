import dotenv from 'dotenv';
import {
  click, closeBrowser, goto, openBrowser, screenshot, text,
} from 'taiko';
import { authenticateViaTwitter } from './utilities';

describe('save-article', () => {
  beforeEach(async () => {
    dotenv.config();
    await openBrowser();
  });

  afterEach(async () => {
    await screenshot({ path: `./feature-test/screenshots/${expect.getState().currentTestName}.png` });
    await closeBrowser();
  });

  describe('when not logged in', () => {
    it('saves the article to the list', async () => {
      await goto('localhost:8080/articles/10.1101/2020.05.01.072975');
      await click('Save to my list');
      await authenticateViaTwitter();
      const result = await text('Saved to my list').exists();

      expect(result).toBe(true);
    });
  });

  describe('when logged in', () => {
    beforeEach(async () => {
      await goto('localhost:8080/');
      await click('Log in');
      await authenticateViaTwitter();
    });

    it('saves the article to the list', async () => {
      await goto('localhost:8080/articles/10.1101/862755');
      await click('Save to my list');
      const result = await text('Saved to my list').exists();

      expect(result).toBe(true);
    });
  });
});
