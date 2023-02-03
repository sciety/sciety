import {
  $, click, currentURL, goto, openBrowser, into, write, textBox,
} from 'taiko';
import { createUserAccountAndLogIn } from './helpers/create-user-account-and-log-in.helper';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../test/helpers';
import { arbitraryDescriptionPath } from '../test/types/description-path.helper';
import { arbitraryGroupId } from '../test/types/group-id.helper';
import { arbitraryReviewId } from '../test/types/review-id.helper';
import { callApi } from './helpers/call-api.helper';
import { screenshotTeardown } from './utilities';
import { arbitraryUserId } from '../test/types/user-id.helper';
import { arbitraryUserHandle } from '../test/types/user-handle.helper';
import { logInWithSpecifiedUserId } from './helpers/log-in-with-specified-user-id.helper';
import { UserId } from '../src/types/user-id';
import { UserHandle } from '../src/types/user-handle';
import { defaultSignUpAvatarUrl } from '../src/http/forms/create-user-account';

describe('authentication-and-redirect', () => {
  const groupASlug = arbitraryWord();
  const groupBSlug = arbitraryWord();
  const userId = arbitraryUserId();

  beforeAll(async () => {
    const groupId = arbitraryGroupId();
    await callApi('api/create-user', {
      userId,
      handle: arbitraryUserHandle(),
      avatarUrl: 'http://somethingthatproducesa404',
      displayName: arbitraryString(),
    });
    await callApi('api/add-group', {
      groupId,
      name: arbitraryString(),
      shortDescription: arbitraryString(),
      homepage: arbitraryString(),
      avatarPath: 'http://somethingthatproducesa404',
      descriptionPath: arbitraryDescriptionPath(),
      slug: arbitraryWord(),
    });
    await callApi('api/record-evaluation', {
      groupId,
      publishedAt: new Date(),
      evaluationLocator: arbitraryReviewId(),
      articleId: 'doi:10.1101/2020.07.13.199174',
      authors: [],
    });
    await callApi('api/add-group', {
      groupId: arbitraryGroupId(),
      name: arbitraryString(),
      shortDescription: arbitraryString(),
      homepage: arbitraryString(),
      avatarPath: 'http://somethingthatproducesa404',
      descriptionPath: arbitraryDescriptionPath(),
      slug: groupASlug,
    });
    await callApi('api/add-group', {
      groupId: arbitraryGroupId(),
      name: arbitraryString(),
      shortDescription: arbitraryString(),
      homepage: arbitraryString(),
      avatarPath: 'http://somethingthatproducesa404',
      descriptionPath: arbitraryDescriptionPath(),
      slug: groupBSlug,
    });
  });

  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('on completing the sign up journey', () => {
    let newUserId: UserId;
    let userHandle: UserHandle;

    beforeEach(async () => {
      newUserId = arbitraryUserId();
      userHandle = arbitraryUserHandle();
      await goto('localhost:8080/groups');
      await click('Sign Up');
      await logInWithSpecifiedUserId(newUserId);
      await write('Full Name', into(textBox('Display name')));
      await write(userHandle, into(textBox('Handle')));
      const createAccountButton = $('#createAccountButton');
      await click(createAccountButton);
    });

    it('the login button says "Log Out"', async () => {
      const buttonText = await $('.utility-bar__list_link_button').text();

      expect(buttonText).toBe('Log Out');
    });

    it('i can navigate to my lists from the utility bar', async () => {
      await click('My lists');
      const result = await currentURL();

      expect(result).toContain('/users');
    });

    it('i can see my handle in the utility bar', async () => {
      const utilityBar = await $('.utility-bar').text();

      expect(utilityBar).toContain(userHandle);
    });

    it('i can see a default avatar in the utility bar', async () => {
      const avatar = await $('.utility-bar-user-avatar').attribute('src');

      expect(avatar).toStrictEqual(defaultSignUpAvatarUrl);
    });

    it.todo('clicking the back button doesn\'t result in an error');
  });

  describe('after clicking the Log In button', () => {
    let userHandle: UserHandle;
    const userAvatar = arbitraryUri();

    beforeEach(async () => {
      userHandle = arbitraryUserHandle();
      await createUserAccountAndLogIn(arbitraryUserId(), userHandle, userAvatar);
    });

    it('the login button says "Log Out"', async () => {
      const buttonText = await $('.utility-bar__list_link_button').text();

      expect(buttonText).toBe('Log Out');
    });

    it('i can navigate to my lists from the utility bar', async () => {
      await click('My lists');
      const result = await currentURL();

      expect(result).toContain('/users');
    });

    it('i can see my handle in the utility bar', async () => {
      const utilityBar = await $('.utility-bar').text();

      expect(utilityBar).toContain(userHandle);
    });

    it('i can see my avatar in the utility bar', async () => {
      const avatar = await $('.utility-bar-user-avatar').attribute('src');

      expect(avatar).toStrictEqual(userAvatar);
    });

    it.todo('clicking the back button doesn\'t result in an error');
  });

  describe('when I am logged in', () => {
    beforeEach(async () => {
      await createUserAccountAndLogIn(arbitraryUserId());
    });

    describe('after clicking the Log Out button', () => {
      beforeEach(async () => {
        await click('Log Out');
      });

      it('the log in button says Log In', async () => {
        const buttonText = await $('.utility-bar__list_link_button').text();

        expect(buttonText).toBe('Log In');
      });

      it.todo('clicking the back button doesn\'t result in an error');
    });

    describe('after clicking on the thumbs down button for an evaluation', () => {
      beforeEach(async () => {
        await goto('localhost:8080/articles/10.1101/2020.07.13.199174');
        await click($('.activity-feed__item:first-child button[value="respond-not-helpful"]'));
      });

      it('returns to the review fragment on the article page', async () => {
        const result = await currentURL();

        expect(result).toContain('10.1101/2020.07.13.199174');
        expect(result).toMatch(/.*#[a-z]*:/);
      });
    });

    describe('after clicking on the Follow button', () => {
      beforeEach(async () => {
        await goto(`localhost:8080/groups/${groupBSlug}`);
        await click('Follow');
      });

      it('returns to the group page', async () => {
        const result = await currentURL();

        expect(result).toContain(`/groups/${groupBSlug}`);
      });
    });
  });
});
