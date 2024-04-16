import {
  click, currentURL, goto, openBrowser,
} from 'taiko';
import { arbitraryCreateUserAccountCommand } from '../../test/write-side/commands/create-user-account-command.helper';
import * as api from '../helpers/api-helpers';
import { completeLoginViaStubWithSpecifiedUserId } from '../helpers/complete-login-via-stub-with-specified-user-id';
import { isLoggedIn } from '../helpers/is-logged-in';
import { screenshotTeardown } from '../utilities';

describe('multiple-logins', () => {
  const createUserAccountCommand = arbitraryCreateUserAccountCommand();

  beforeAll(async () => {
    await api.createUser(createUserAccountCommand);
  });

  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when I start to log in from the article page, but don\'t complete the flow', () => {
    const articleId = '10.1101/2022.09.23.22280264';
    const articlePage = `localhost:8080/articles/activity/${articleId}`;
    const scietyFeedPage = 'localhost:8080/sciety-feed';

    beforeEach(async () => {
      await goto(articlePage);
      await click('Log In');
    });

    describe('when I then complete a log in from the Sciety feed page', () => {
      beforeEach(async () => {
        await goto(scietyFeedPage);
        await click('Log In');
        await completeLoginViaStubWithSpecifiedUserId(createUserAccountCommand.userId);
      });

      it('i am still on the Sciety feed page', async () => {
        expect(await currentURL()).toBe(`http://${scietyFeedPage}`);
      });

      it('i am logged in', async () => {
        expect(await isLoggedIn()).toBe(true);
      });
    });
  });

  describe('when I am on the article page and I log in successfully', () => {
    const articleId = '10.1101/2022.09.23.22280264';
    const articlePage = `localhost:8080/articles/activity/${articleId}`;

    beforeEach(async () => {
      await goto(articlePage);
      await click('Log In');
      await completeLoginViaStubWithSpecifiedUserId(createUserAccountCommand.userId);
    });

    describe('when I log out and go to the Sciety feed page', () => {
      const scietyFeedPage = 'localhost:8080/sciety-feed';

      beforeEach(async () => {
        await click('Log out');
        await goto(scietyFeedPage);
      });

      describe('when I log in successfully again', () => {
        beforeEach(async () => {
          await click('Log In');
          await completeLoginViaStubWithSpecifiedUserId(createUserAccountCommand.userId);
        });

        it('i am still on the Sciety feed page', async () => {
          const result = await currentURL();

          expect(result).toContain(scietyFeedPage);
        });
      });
    });
  });
});
