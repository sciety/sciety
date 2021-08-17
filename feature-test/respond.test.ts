import dotenv from 'dotenv';
import {
  $, click, goto, openBrowser, text, toLeftOf,
} from 'taiko';
import { authenticateViaTwitter, screenshotTeardown } from './utilities';

describe('respond', () => {
  beforeEach(async () => {
    dotenv.config();
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when not logged in', () => {
    it('authenticates via twitter, returns and displays increased response count', async () => {
      await goto('localhost:8080/articles/10.1101/2020.07.13.199174');
      await click($('.activity-feed__item:first-child button img[src*="thumb-up-outline"]'));
      await authenticateViaTwitter();
      const result = await text('1', toLeftOf($('.activity-feed__item:first-child button img[src*="thumb-up-solid"]'))).exists();

      expect(result).toBe(true);
    });
  });
});
