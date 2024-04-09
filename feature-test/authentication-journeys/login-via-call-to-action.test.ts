import {
  click, currentURL, goto, openBrowser,
} from 'taiko';
import { screenshotTeardown } from '../utilities';
import { completeLoginViaStubWithSpecifiedUserId } from '../helpers/complete-login-via-stub-with-specified-user-id';
import { arbitraryArticleId } from '../../test/types/article-id.helper';
import * as api from '../helpers/api-helpers';
import { arbitraryAddGroupCommand } from '../../test/write-side/commands/add-group-command.helper';
import { arbitraryCreateUserAccountCommand } from '../../test/write-side/commands/create-user-account-command.helper';
import { isLoggedIn } from '../helpers/is-logged-in';

describe('login-via-call-to-action', () => {
  const addGroupCommand = arbitraryAddGroupCommand();
  const createUserAccountCommand = arbitraryCreateUserAccountCommand();

  beforeAll(async () => {
    await api.createUser(createUserAccountCommand);
    await api.addGroup(addGroupCommand);
  });

  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when I am on the group page and I am not logged in', () => {
    const groupPage = `http://localhost:8080/groups/${addGroupCommand.slug}/feed`;

    beforeEach(async () => {
      await goto(groupPage);
    });

    describe('when I attempt to follow the group and successfully log in', () => {
      beforeEach(async () => {
        await click('Follow');
        await completeLoginViaStubWithSpecifiedUserId(createUserAccountCommand.userId);
      });

      it('i am still on the group page', async () => {
        expect(await currentURL()).toBe(groupPage);
      });

      it('i am logged in', async () => {
        expect(await isLoggedIn()).toBe(true);
      });
    });
  });

  describe('when I am on the article page and I am not logged in', () => {
    describe('after clicking Log in to save this article', () => {
      const articleId = arbitraryArticleId();
      const articlePage = `localhost:8080/articles/activity/${articleId.value}`;

      beforeEach(async () => {
        await goto(articlePage);
        await click('Log in to save this article');
        await completeLoginViaStubWithSpecifiedUserId(createUserAccountCommand.userId);
      });

      it('i am still on the article page', async () => {
        expect(await currentURL()).toContain(articlePage);
      });

      it('i am logged in', async () => {
        expect(await isLoggedIn()).toBe(true);
      });
    });
  });
});
