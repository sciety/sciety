import {
  $, click, goto, into, openBrowser, textBox, write,
} from 'taiko';
import { arbitraryString } from '../test/helpers';
import { arbitraryUserHandle } from '../test/types/user-handle.helper';
import { arbitraryUserId } from '../test/types/user-id.helper';
import { callApi } from './helpers/call-api.helper';
import { screenshotTeardown } from './utilities';

describe('journey-to-user-list', () => {
  const userId = arbitraryUserId();

  beforeAll(async () => {
    await callApi('api/create-user', {
      userId,
      handle: arbitraryUserHandle(),
      avatarUrl: 'http://somethingthatproducesa404',
      displayName: arbitraryString(),
    });
  });

  afterEach(screenshotTeardown);

  describe('when logged in', () => {
    beforeEach(async () => {
      await openBrowser();
      await goto('localhost:8080/');
      await click('Log in');
      await write(userId, into(textBox('User id')));
      await click('Log in');
    });

    it('navigates to user list page via user page', async () => {
      await goto('localhost:8080/');
      await click('My lists');
      await click('Saved articles');
      const pageTitle = await $('h1').text();

      expect(pageTitle).toContain('saved articles');
    });

    it('navigates to the saved articles list from an article page', async () => {
      await goto('localhost:8080/articles/activity/10.1101/2021.06.09.21258556');
      await click('Save to my list');
      await click('Saved to my list');
      const pageTitle = await $('h1').text();

      expect(pageTitle).toContain('saved articles');
    });
  });
});
