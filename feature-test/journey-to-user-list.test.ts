import dotenv from 'dotenv';
import {
  $, click, goto, openBrowser, text, within,
} from 'taiko';
import { authenticateViaTwitter, screenshotTeardown } from './utilities';

describe('journey-to-user-list', () => {
  beforeEach(async () => {
    dotenv.config();
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when logged in', () => {
    beforeEach(async () => {
      await goto('localhost:8080/');
      await click('Log in');
      await authenticateViaTwitter();
    });

    it('navigates to user list page via user page', async () => {
      await click('My profile');
      await click('Saved articles');
      const correctPage = await text('Saved Articles', within($('h1'))).exists();

      expect(correctPage).toBe(true);
    });

    it('navigates to the saved articles list from an article page', async () => {
      await goto('localhost:8080/articles/activity/10.1101/2021.06.09.21258556');
      await click('Save to my list');
      await click('Saved to my list');
      await click('Saved articles');
      const correctPage = await text('Saved Articles', within($('h1'))).exists();

      expect(correctPage).toBe(true);
    });
  });
});
