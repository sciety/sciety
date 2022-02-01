import {
  $, click, goto, openBrowser, text, within,
} from 'taiko';
import { screenshotTeardown } from './utilities';

describe('follow a group', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when logged in', () => {
    beforeEach(async () => {
      await goto('localhost:8080/');
      await click('Log in');
    });

    it('adds the group to my profile page', async () => {
      const groupToBeFollowed = 'Biophysics Colab';
      await goto('localhost:8080/groups');
      await click(groupToBeFollowed);
      await click('Follow');
      await click('My profile');
      await click('Following');
      const groupExists = await text(groupToBeFollowed, within($('.followed-groups-list'))).exists();

      expect(groupExists).toBe(true);
    });
  });
});
