import {
  $, click, goto, openBrowser, text, within,
} from 'taiko';
import { screenshotTeardown } from './utilities';

describe('unfollow a group', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when logged in', () => {
    beforeEach(async () => {
      await goto('localhost:8080/');
      await click('Log in');
    });

    describe('from the ScreenIT group page', () => {
      it('removes the group from my profile page', async () => {
        await goto('localhost:8080/groups/screenit');
        await click('Follow');
        await click('Unfollow');
        await click('My profile');
        const groupExists = await text('ScreenIT', within($('.followed-groups'))).exists();

        expect(groupExists).toBe(false);
      });
    });
  });
});
