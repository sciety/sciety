import dotenv from 'dotenv';
import {
  $, button, click, closeBrowser, goto, openBrowser, screenshot, text, within,
} from 'taiko';
import { authenticateViaTwitter } from './utilities';

describe('unfollow a group', () => {
  beforeEach(async () => {
    dotenv.config();
    await openBrowser();
  });

  afterEach(async () => {
    await screenshot({ path: `./feature-test/screenshots/${expect.getState().currentTestName}.png` });
    await closeBrowser();
  });

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
