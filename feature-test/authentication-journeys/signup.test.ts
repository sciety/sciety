import {
  $, click, goto, openBrowser, into, write, textBox,
} from 'taiko';
import { arbitraryString } from '../../test/helpers';
import { callApi } from '../helpers/call-api.helper';
import { screenshotTeardown } from '../utilities';
import { arbitraryUserId } from '../../test/types/user-id.helper';
import { arbitraryUserHandle } from '../../test/types/user-handle.helper';
import { completeLoginViaStubWithSpecifiedUserId } from '../helpers/complete-login-via-stub-with-specified-user-id';
import { UserHandle } from '../../src/types/user-handle';

describe('signup', () => {
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

  describe('on completing the sign up journey', () => {
    let newUserHandle: UserHandle;

    beforeEach(async () => {
      const newUserId = arbitraryUserId();
      newUserHandle = arbitraryUserHandle();
      await goto('localhost:8080/groups');
      await click('Sign Up');
      await completeLoginViaStubWithSpecifiedUserId(newUserId);
      await write('Full Name', into(textBox('Full name')));
      await write(newUserHandle, into(textBox('Create a handle')));
      const createAccountButton = $('#createAccountButton');
      await click(createAccountButton);
    });

    it('i am logged in', async () => {
      const buttonText = await $('.utility-bar__list_link_button').text();

      expect(buttonText).toBe('Log Out');
    });

    it('the handle I supplied is used for my account', async () => {
      const utilityBar = await $('.utility-bar').text();

      expect(utilityBar).toContain(newUserHandle);
    });

    it.todo('clicking the back button doesn\'t result in an error');
  });
});
