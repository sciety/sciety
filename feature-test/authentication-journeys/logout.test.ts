import {
  $, click, openBrowser,
} from 'taiko';
import { createUserAccountAndLogIn } from '../helpers/create-user-account-and-log-in.helper';
import { arbitraryString } from '../../test/helpers';
import { callApi } from '../helpers/call-api.helper';
import { screenshotTeardown } from '../utilities';
import { arbitraryUserId } from '../../test/types/user-id.helper';
import { arbitraryUserHandle } from '../../test/types/user-handle.helper';

describe('logout', () => {
  const userId = arbitraryUserId();
  const existingUserHandle = arbitraryUserHandle();

  beforeAll(async () => {
    await callApi('api/create-user', {
      userId,
      handle: existingUserHandle,
      avatarUrl: 'http://somethingthatproducesa404',
      displayName: arbitraryString(),
    });
  });

  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when I am logged in', () => {
    beforeEach(async () => {
      await createUserAccountAndLogIn(arbitraryUserId());
    });

    describe('after clicking the Log Out button', () => {
      beforeEach(async () => {
        await click('Log Out');
      });

      it('i am logged out', async () => {
        const buttonText = await $('.utility-bar__list_link_button').text();

        expect(buttonText).toBe('Log In');
      });

      it.todo('clicking the back button doesn\'t result in an error');
    });
  });
});
