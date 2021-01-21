import dotenv from 'dotenv';
import {
  click, closeBrowser, goto, into, openBrowser, text, textBox, write,
} from 'taiko';

jest.setTimeout(15000);

describe('save-article', () => {
  beforeEach(async () => {
    dotenv.config();
    await openBrowser();
  });

  afterEach(closeBrowser);

  describe('when not logged in', () => {
    it('saves the article to the list', async () => {
      await goto('localhost:8080/articles/10.1101/2020.05.01.072975');
      await click('Save to my list');
      await write(process.env.TAIKO_TWITTER_USERNAME ?? '', into(textBox('Username')));
      await write(process.env.TAIKO_TWITTER_PASSWORD ?? '', into(textBox('Password')));
      await click('Sign in');
      const result = await text('Saved to my list').exists();

      expect(result).toBe(true);
    });
  });

  describe('when logged in', () => {
    beforeEach(async () => {
      await goto('localhost:8080/');
      await click('Log in');
      await write(process.env.TAIKO_TWITTER_USERNAME ?? '', into(textBox('Username')));
      await write(process.env.TAIKO_TWITTER_PASSWORD ?? '', into(textBox('Password')));
      await click('Sign in');
    });

    it('saves the article to the list', async () => {
      await goto('localhost:8080/articles/10.1101/862755');
      await click('Save to my list');
      const result = await text('Saved to my list').exists();

      expect(result).toBe(true);
    });
  });
});
