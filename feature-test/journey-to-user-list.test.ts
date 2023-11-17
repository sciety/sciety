import {
  $, click, goto, openBrowser,
} from 'taiko';
import { completeLoginViaStubWithSpecifiedUserId } from './helpers/complete-login-via-stub-with-specified-user-id.js';
import { arbitraryString } from '../test/helpers.js';
import { arbitraryUserHandle } from '../test/types/user-handle.helper.js';
import { arbitraryUserId } from '../test/types/user-id.helper.js';
import { callApi } from './helpers/call-api.helper.js';
import { screenshotTeardown } from './utilities.js';

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
      await completeLoginViaStubWithSpecifiedUserId(userId);
    });

    it('navigates to user list page via user page', async () => {
      await goto('localhost:8080/');
      await click('My lists');
      await click('Saved articles');
      const pageTitle = await $('h1').text();

      expect(pageTitle).toContain('saved articles');
    });
  });
});
