import {
  $, click, goto, openBrowser, into, write, textBox, currentURL,
} from 'taiko';
import { screenshotTeardown } from '../utilities.js';
import { arbitraryUserId } from '../../test/types/user-id.helper.js';
import { arbitraryUserHandle } from '../../test/types/user-handle.helper.js';
import { completeLoginViaStubWithSpecifiedUserId } from '../helpers/complete-login-via-stub-with-specified-user-id.js';
import { UserHandle } from '../../src/types/user-handle.js';
import { isLoggedIn } from '../helpers/is-logged-in.js';

describe('signup', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('on completing the sign up journey', () => {
    let newUserHandle: UserHandle;
    const startingPage = 'http://localhost:8080/groups';

    beforeEach(async () => {
      const newUserId = arbitraryUserId();
      newUserHandle = arbitraryUserHandle();
      await goto(startingPage);
      await click('Sign Up');
      await completeLoginViaStubWithSpecifiedUserId(newUserId);
      await write('Full Name', into(textBox('Full name')));
      await write(newUserHandle, into(textBox('Create a handle')));
      const createAccountButton = $('#createAccountButton');
      await click(createAccountButton);
    });

    it('i am logged in', async () => {
      expect(await isLoggedIn()).toBe(true);
    });

    it('the handle I supplied is used for my account', async () => {
      const utilityBar = await $('.utility-bar').text();

      expect(utilityBar).toContain(newUserHandle);
    });

    it('i am back on my starting page', async () => {
      const currentPage = await currentURL();

      expect(currentPage).toBe(startingPage);
    });

    it.todo('clicking the back button doesn\'t result in an error');
  });
});
