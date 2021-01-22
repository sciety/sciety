import dotenv from 'dotenv';
import {
  $, click, closeBrowser, goto, into, openBrowser, text, textBox, toRightOf, write,
} from 'taiko';

jest.setTimeout(15000);

describe('respond', () => {
  afterAll(closeBrowser);

  describe('when not logged in', () => {
    it('displays increased response count', async () => {
      dotenv.config();
      await openBrowser();
      await goto('localhost:8080/articles/10.1101/2020.07.13.199174');
      await click('Got it!');
      await click($('.article-feed__item:first-child button[value="respond-helpful"]'));
      await write(process.env.TAIKO_TWITTER_USERNAME ?? '', into(textBox('Username')));
      await write(process.env.TAIKO_TWITTER_PASSWORD ?? '', into(textBox('Password')));
      await click('Sign in');
      const result = await text('1', toRightOf($('.article-feed__item:first-child button[value="revoke-response"]'))).exists();

      expect(result).toBe(true);
    });
  });
});
