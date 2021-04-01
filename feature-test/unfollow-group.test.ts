import dotenv from 'dotenv';
import {
  $, button, click, closeBrowser, goto, openBrowser, text, within,
} from 'taiko';
import { authenticateViaTwitter } from './utilities';

describe('unfollow a group', () => {
  beforeEach(async () => {
    dotenv.config();
    await openBrowser();
  });

  afterEach(closeBrowser);

  describe('when logged in', () => {
    beforeEach(async () => {
      await goto('localhost:8080/');
      await click('Log in');
      await authenticateViaTwitter();
    });

    describe('from the home page', () => {
      it('removes the group to my profile page', async () => {
        await goto('localhost:8080');
        await click(button({ 'aria-label': 'Follow PeerJ' }));
        await click(button({ 'aria-label': 'Unfollow PeerJ' }));
        await click('My profile');
        const groupExists = await text('PeerJ', within($('.followed-groups'))).exists();

        expect(groupExists).toBe(false);
      });
    });
  });
});
