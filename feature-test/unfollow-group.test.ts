import dotenv from 'dotenv';
import {
  $, click, goto, openBrowser, text, within,
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

    describe('from the ScreenIT group page', () => {
      it('removes the group from my profile page', async () => {
        await goto('localhost:8080/groups');
        await click('ScreenIT');
        await click('Follow');
        await click('Unfollow');
        await click('My profile');
        const groupExists = await text('ScreenIT', within($('.followed-groups'))).exists();

        expect(groupExists).toBe(false);
      });
    });
  });
});
