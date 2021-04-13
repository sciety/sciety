import dotenv from 'dotenv';
import {
  $, button, click, goto, openBrowser, text, within,
} from 'taiko';
import { authenticateViaTwitter, screenshotTeardown } from './utilities';

describe('unfollow a group', () => {
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

    describe('from the home page', () => {
      it('removes the group to my profile page', async () => {
        await goto('localhost:8080');
        await click(button({ 'aria-label': 'Follow NCRC' }));
        await click(button({ 'aria-label': 'Unfollow NCRC' }));
        await click('My profile');
        const groupExists = await text('NCRC', within($('.followed-groups'))).exists();

        expect(groupExists).toBe(false);
      });
    });
  });
});
