import dotenv from 'dotenv';
import {
  $, click, closeBrowser, goto, openBrowser, text, toRightOf,
} from 'taiko';
import { authenticateViaTwitter } from './utilities';

describe('respond', () => {
  beforeEach(async () => {
    dotenv.config();
    await openBrowser();
  });

  afterEach(closeBrowser);

  describe('when not logged in', () => {
    it('authenticates via twitter, returns and displays increased response count', async () => {
      await goto('localhost:8080/articles/10.1101/2020.07.13.199174');
      await click('Got it!');
      await click($('.article-feed__item:first-child button[value="respond-helpful"]'));
      await authenticateViaTwitter();
      const result = await text('1', toRightOf($('.article-feed__item:first-child button[value="revoke-response"]'))).exists();

      expect(result).toBe(true);
    });
  });
});
