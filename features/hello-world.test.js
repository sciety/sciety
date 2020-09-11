import {
  click, closeBrowser, goto, openBrowser, text,
} from 'taiko';

describe('taiko with Jest', () => {
  beforeAll(async () => {
    await openBrowser();
  });

  describe('homepage', () => {
    it('shows the title', async () => {
      await goto('localhost:8080');

      expect(await text('The Hive').exists()).toBe(true);
    });
  });

  describe('log in from homepage', () => {
    it('takes us to twitter', async () => {
      await goto('localhost:8080');
      await click('Log in');

      expect(await text('Sign up for Twitter').exists()).toBe(true);
    });
  });

  afterAll(async () => {
    await closeBrowser();
  });
});
