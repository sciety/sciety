import {
  click, currentURL, goto, openBrowser,
} from 'taiko';
import { arbitraryArticleId } from '../../test/types/article-id.helper';
import { arbitraryUserId } from '../../test/types/user-id.helper';
import { createUserAccountAndLogIn } from '../helpers/create-user-account-and-log-in.helper';
import { isLoggedOut } from '../helpers/is-logged-out';
import { screenshotTeardown } from '../utilities';

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
        await goto(`localhost:8080/articles/${arbitraryArticleId().value}`);
        await click('Log Out');
      });

      it('i am logged out', async () => {
        expect(await isLoggedOut()).toBe(true);
      });

      it('i am on the home page', async () => {
        const currentPage = await currentURL();

        expect(currentPage).toBe('http://localhost:8080/');
      });

      it.todo('clicking the back button doesn\'t result in an error');
    });
  });
});
