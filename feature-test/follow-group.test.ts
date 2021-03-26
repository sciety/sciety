import dotenv from 'dotenv';
import {
  $, button, click, closeBrowser, goto, openBrowser, text, within,
} from 'taiko';
import { authenticateViaTwitter } from './utilities';

describe('follow a group', () => {
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
      it('adds the group to my profile page', async () => {
        await goto('localhost:8080');
        await click(button({ 'aria-label': 'Follow NCRC' }));
        await click('My profile');
        const groupExists = await text('NCRC', within($('.followed-groups'))).exists();

        expect(groupExists).toBe(true);
      });
    });

    describe('from the group page', () => {
      it('adds the group to my profile page', async () => {
        await goto('localhost:8080');
        await click('PeerJ');
        await click('Follow');
        await click('My profile');
        const groupExists = await text('PeerJ', within($('.followed-groups'))).exists();

        expect(groupExists).toBe(true);
      });
    });

    describe('from the profile of another user', () => {
      it.todo('adds the group to my profile page');
    });
  });
});
