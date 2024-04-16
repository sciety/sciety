import {
  $, click, goto, openBrowser,
} from 'taiko';
import { callApi } from './helpers/call-api.helper';
import { completeLoginViaStubWithSpecifiedUserId } from './helpers/complete-login-via-stub-with-specified-user-id';
import { screenshotTeardown } from './utilities';
import { arbitraryString } from '../test/helpers';
import { arbitraryUserHandle } from '../test/types/user-handle.helper';
import { arbitraryUserId } from '../test/types/user-id.helper';

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
