import {
  $, click, openBrowser,
} from 'taiko';
import { createUserAccountAndLogIn } from '../helpers/create-user-account-and-log-in.helper';
import { screenshotTeardown } from '../utilities';
import { arbitraryUserId } from '../../test/types/user-id.helper';

describe('logout', () => {
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
