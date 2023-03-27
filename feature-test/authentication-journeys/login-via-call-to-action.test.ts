import {
  $, click, currentURL, goto, openBrowser,
} from 'taiko';
import { screenshotTeardown } from '../utilities';
import { completeLoginViaStubWithSpecifiedUserId } from '../helpers/complete-login-via-stub-with-specified-user-id';
import { arbitraryGroup } from '../../test/types/group.helper';
import { arbitraryArticleId } from '../../test/types/article-id.helper';
import * as api from '../helpers/api-helpers';
import { arbitraryUserDetails } from '../../test/types/user-details.helper';

describe('login-via-call-to-action', () => {
  const groupA = arbitraryGroup();
  const userDetails = arbitraryUserDetails();

  beforeAll(async () => {
    await api.createUser(userDetails);
    await api.addGroup(groupA);
  });

  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when I am on the group page and I am not logged in', () => {
    const groupPageAboutTab = `http://localhost:8080/groups/${groupA.slug}/about`;

    beforeEach(async () => {
      await goto(groupPageAboutTab);
    });

    describe('when I attempt to follow the group and successfully log in', () => {
      beforeEach(async () => {
        await click('Follow');
        await completeLoginViaStubWithSpecifiedUserId(userDetails.id);
      });

      it('i am still on the group page and I am logged in', async () => {
        const result = await currentURL();
        const buttonText = await $('.utility-bar__list_link_button').text();

        expect(result).toBe(groupPageAboutTab);
        expect(buttonText).toBe('Log Out');
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
        await completeLoginViaStubWithSpecifiedUserId(userDetails.id);
      });

      it('i am still on the article page and I am logged in', async () => {
        const buttonText = await $('.utility-bar__list_link_button').text();
        const result = await currentURL();

        expect(result).toContain(articlePage);
        expect(buttonText).toBe('Log Out');
      });
    });
  });
});
