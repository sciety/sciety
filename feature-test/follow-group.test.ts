import dotenv from 'dotenv';
import {
  $, click, closeBrowser, goto, openBrowser, screenshot, text, within,
} from 'taiko';
import { authenticateViaTwitter } from './utilities';

describe('follow a group', () => {
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
  });
});
